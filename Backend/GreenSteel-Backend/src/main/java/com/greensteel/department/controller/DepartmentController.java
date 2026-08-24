package com.greensteel.department.controller;

import com.greensteel.common.response.ApiResponse;
import com.greensteel.department.dto.request.DepartmentRequest;
import com.greensteel.department.dto.response.DepartmentResponse;
import com.greensteel.department.service.DepartmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<DepartmentResponse>> addDepartment(
            @Valid @RequestBody DepartmentRequest request) {

        return ResponseEntity.ok(
                ApiResponse.<DepartmentResponse>builder()
                        .success(true)
                        .message("Department created successfully")
                        .data(departmentService.addDepartment(request))
                        .build()
        );
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<DepartmentResponse>>> getAllDepartments() {

        return ResponseEntity.ok(
                ApiResponse.<List<DepartmentResponse>>builder()
                        .success(true)
                        .message("Departments fetched successfully")
                        .data(departmentService.getAllDepartments())
                        .build()
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<DepartmentResponse>> getDepartmentById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                ApiResponse.<DepartmentResponse>builder()
                        .success(true)
                        .message("Department fetched successfully")
                        .data(departmentService.getDepartmentById(id))
                        .build()
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<DepartmentResponse>> updateDepartment(
            @PathVariable Long id,
            @Valid @RequestBody DepartmentRequest request) {

        return ResponseEntity.ok(
                ApiResponse.<DepartmentResponse>builder()
                        .success(true)
                        .message("Department updated successfully")
                        .data(departmentService.updateDepartment(id, request))
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteDepartment(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                ApiResponse.<String>builder()
                        .success(true)
                        .message("Department deleted successfully")
                        .data(departmentService.deleteDepartment(id))
                        .build()
        );
    }
}