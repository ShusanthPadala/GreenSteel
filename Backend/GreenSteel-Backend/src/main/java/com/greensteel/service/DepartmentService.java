package com.greensteel.service;

import com.greensteel.entity.Department;
import com.greensteel.repository.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public Department addDepartment(Department department) {
        return departmentRepository.save(department);
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }
    public Department getDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));
    }
    public Department updateDepartment(Long id, Department updatedDepartment) {

        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        department.setDepartmentName(updatedDepartment.getDepartmentName());
        department.setDepartmentCode(updatedDepartment.getDepartmentCode());
        department.setDescription(updatedDepartment.getDescription());
        department.setActive(updatedDepartment.getActive());

        return departmentRepository.save(department);
    }
    public String deleteDepartment(Long id) {

        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        departmentRepository.delete(department);

        return "Department deleted successfully";
    }
}