package com.greensteel.department.service;

import com.greensteel.department.dto.request.DepartmentRequest;
import com.greensteel.department.dto.response.DepartmentResponse;
import com.greensteel.department.entity.Department;
import com.greensteel.department.mapper.DepartmentMapper;
import com.greensteel.department.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentResponse addDepartment(DepartmentRequest request) {

        Department department = DepartmentMapper.toEntity(request);

        if (department.getActive() == null) {
            department.setActive(true);
        }

        return DepartmentMapper.toResponse(
                departmentRepository.save(department)
        );
    }

    public List<DepartmentResponse> getAllDepartments() {

        return departmentRepository.findAll()
                .stream()
                .map(DepartmentMapper::toResponse)
                .toList();
    }

    public DepartmentResponse getDepartmentById(Long id) {

        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        return DepartmentMapper.toResponse(department);
    }

    public DepartmentResponse updateDepartment(
            Long id,
            DepartmentRequest request) {

        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        department.setDepartmentName(request.getDepartmentName());
        department.setDepartmentCode(request.getDepartmentCode());
        department.setDescription(request.getDescription());
        department.setActive(request.getActive());

        return DepartmentMapper.toResponse(
                departmentRepository.save(department)
        );
    }

    public String deleteDepartment(Long id) {

        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        departmentRepository.delete(department);

        return "Department deleted successfully";
    }
}