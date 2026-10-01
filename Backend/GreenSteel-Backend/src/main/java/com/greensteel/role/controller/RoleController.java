package com.greensteel.role.controller;

import com.greensteel.common.response.ApiResponse;
import com.greensteel.role.entity.Role;
import com.greensteel.role.service.RoleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Roles API. Responses use the same ApiResponse wrapper as every other
 * endpoint ({ success, message, data }).
 */
@RestController
@RequestMapping("/roles")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    // Only SUPER_ADMIN can create roles
    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Role>> addRole(@RequestBody Role role) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<Role>builder()
                        .success(true)
                        .message("Role created successfully")
                        .data(roleService.addRole(role))
                        .build());
    }

    // Any logged-in user can view all roles
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<Role>>> getAllRoles() {
        return ResponseEntity.ok(
                ApiResponse.<List<Role>>builder()
                        .success(true)
                        .message("Roles fetched successfully")
                        .data(roleService.getAllRoles())
                        .build());
    }

    // Any logged-in user can view a role
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Role>> getRoleById(@PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.<Role>builder()
                        .success(true)
                        .message("Role fetched successfully")
                        .data(roleService.getRoleById(id))
                        .build());
    }

    // Only SUPER_ADMIN can update roles
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Role>> updateRole(
            @PathVariable Long id,
            @RequestBody Role role) {
        return ResponseEntity.ok(
                ApiResponse.<Role>builder()
                        .success(true)
                        .message("Role updated successfully")
                        .data(roleService.updateRole(id, role))
                        .build());
    }

    // Only SUPER_ADMIN can delete roles
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteRole(@PathVariable Long id) {
        String message = roleService.deleteRole(id);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message(message)
                        .data(null)
                        .build());
    }
}
