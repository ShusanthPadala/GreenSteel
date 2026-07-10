package com.greensteel.role.controller;

import com.greensteel.role.entity.Role;
import com.greensteel.role.service.RoleService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public Role addRole(@RequestBody Role role) {
        return roleService.addRole(role);
    }

    // Any logged-in user can view all roles
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<Role> getAllRoles() {
        return roleService.getAllRoles();
    }

    // Any logged-in user can view a role
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public Role getRoleById(@PathVariable Long id) {
        return roleService.getRoleById(id);
    }

    // Only SUPER_ADMIN can update roles
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public Role updateRole(
            @PathVariable Long id,
            @RequestBody Role role) {

        return roleService.updateRole(id, role);
    }

    // Only SUPER_ADMIN can delete roles
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public String deleteRole(@PathVariable Long id) {
        return roleService.deleteRole(id);
    }
}