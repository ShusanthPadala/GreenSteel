package com.greensteel.security.access;

import com.greensteel.security.userdetails.CustomUserDetails;
import com.greensteel.user.entity.User;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Objects;
import java.util.Set;

/**
 * Server-side role matrix for GreenSteel.
 *
 * Mirrors the frontend's src/constants/permissions.js so the API enforces the
 * same rules the UI shows. Use it from controllers with
 * {@code @PreAuthorize("@access.can('emission-records', 'create')")} and from
 * services with {@link #requireDepartment(Long)} for department-scoped roles.
 *
 * Reads stay plant-wide on purpose: departments are linked by gas flows, so
 * every role needs to see how the departments that feed it are doing.
 */
@Component("access")
public class AccessPolicy {

    public static final String CREATE = "create";
    public static final String EDIT = "edit";
    public static final String DELETE = "delete";
    public static final String RESOLVE = "resolve";

    private static final Set<String> ALL = Set.of(CREATE, EDIT, DELETE);
    private static final Set<String> CREATE_EDIT = Set.of(CREATE, EDIT);
    private static final Set<String> EDIT_ONLY = Set.of(EDIT);

    /** Plant engineers: record emissions and update unit status for their own department only. */
    private static final Set<String> DEPARTMENT_ENGINEERS = Set.of(
            "BLAST_FURNACE_ENGINEER", "COKE_OVEN_ENGINEER", "SINTER_PLANT_ENGINEER",
            "SMS_ENGINEER", "POWER_PLANT_ENGINEER", "UTILITIES_ENGINEER"
    );

    private static final Map<String, Set<String>> ENGINEER_ACTIONS = Map.of(
            "units", EDIT_ONLY,
            "emission-records", CREATE_EDIT,
            "alerts", Set.of(RESOLVE)
    );

    /** role -> resource -> allowed actions (resources managed only by SUPER_ADMIN are not listed). */
    private static final Map<String, Map<String, Set<String>>> MATRIX = Map.of(
            "PLANT_ADMIN", Map.of(
                    "units", ALL, "emission-records", ALL, "reports", ALL, "alerts", Set.of(RESOLVE)),
            "ESG_OFFICER", Map.of(
                    "reports", ALL),
            "ENVIRONMENTAL_OFFICER", Map.of(
                    "emission-records", CREATE_EDIT, "reports", CREATE_EDIT, "alerts", Set.of(RESOLVE)),
            "SAFETY_OFFICER", Map.of(
                    "reports", CREATE_EDIT, "alerts", Set.of(RESOLVE)),
            "MAINTENANCE_ENGINEER", Map.of(
                    "units", EDIT_ONLY),
            "PRODUCTION_MANAGER", Map.of(
                    "reports", CREATE_EDIT),
            "QUALITY_ENGINEER", Map.of(
                    "emission-records", EDIT_ONLY, "reports", CREATE_EDIT)
    );

    /** Can the signed-in user perform {@code action} on {@code resource}? */
    public boolean can(String resource, String action) {
        String role = currentRole();
        if (role == null) {
            return false;
        }
        if ("SUPER_ADMIN".equals(role)) {
            return true;
        }
        Map<String, Set<String>> actions = DEPARTMENT_ENGINEERS.contains(role)
                ? ENGINEER_ACTIONS
                : MATRIX.getOrDefault(role, Map.of());
        return actions.getOrDefault(resource, Set.of()).contains(action);
    }

    /** True when the user may only change data belonging to their own department. */
    public boolean isDepartmentScoped() {
        return DEPARTMENT_ENGINEERS.contains(currentRole());
    }

    /**
     * For department-scoped roles, reject changes to another department's data.
     * No-op for everyone else.
     */
    public void requireDepartment(Long departmentId) {
        if (!isDepartmentScoped()) {
            return;
        }
        User user = currentUser();
        Long own = user != null && user.getDepartment() != null ? user.getDepartment().getId() : null;
        if (own == null || !Objects.equals(own, departmentId)) {
            throw new AccessDeniedException("You can only change data for your own department.");
        }
    }

    public User currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof CustomUserDetails details) {
            return details.getUser();
        }
        return null;
    }

    public String currentRole() {
        User user = currentUser();
        if (user == null || user.getRole() == null || user.getRole().getRoleName() == null) {
            return null;
        }
        return user.getRole().getRoleName().replaceFirst("^ROLE_", "").toUpperCase();
    }
}
