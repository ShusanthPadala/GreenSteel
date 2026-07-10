package com.greensteel.department.controller;

import com.greensteel.department.entity.Department;
import com.greensteel.department.service.DepartmentService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    // Only SUPER_ADMIN can create departments
    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public Department addDepartment(@RequestBody Department department) {
        return departmentService.addDepartment(department);
    }

    // Any logged-in user can view all departments
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<Department> getAllDepartments() {
        return departmentService.getAllDepartments();
    }

    // Any logged-in user can view a department
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public Department getDepartmentById(@PathVariable Long id) {
        return departmentService.getDepartmentById(id);
    }

    // Only SUPER_ADMIN can update departments
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public Department updateDepartment(
            @PathVariable Long id,
            @RequestBody Department department) {

        return departmentService.updateDepartment(id, department);
    }

    // Only SUPER_ADMIN can delete departments
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public String deleteDepartment(@PathVariable Long id) {
        return departmentService.deleteDepartment(id);
    }
}