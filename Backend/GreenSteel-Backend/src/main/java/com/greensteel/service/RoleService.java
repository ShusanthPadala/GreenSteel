package com.greensteel.service;

import com.greensteel.entity.Role;
import com.greensteel.repository.RoleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {
    private final RoleRepository roleRepository;
    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }
    public Role addRole(Role role) {
        return roleRepository.save(role);
    }
   public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }
    public Role getRoleById(Long id) {
        return roleRepository.findById(id).get();
    }
    public Role updateRole(Long id, Role updatedRole) {

        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        role.setRoleName(updatedRole.getRoleName());
        role.setDescription(updatedRole.getDescription());

        return roleRepository.save(role);
    }
    public String deleteRole(Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        roleRepository.delete(role);
        return "Role deleted successfully";
    }
}
