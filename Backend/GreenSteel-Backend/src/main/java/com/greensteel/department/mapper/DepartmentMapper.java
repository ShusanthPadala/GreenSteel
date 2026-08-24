package com.greensteel.department.mapper;

import com.greensteel.department.dto.request.DepartmentRequest;
import com.greensteel.department.dto.response.DepartmentResponse;
import com.greensteel.department.entity.Department;

public class DepartmentMapper {

    private DepartmentMapper(){}

    public static Department toEntity(DepartmentRequest request){

        Department department = new Department();

        department.setDepartmentName(request.getDepartmentName());
        department.setDepartmentCode(request.getDepartmentCode());
        department.setDescription(request.getDescription());
        department.setActive(request.getActive());

        return department;

    }

    public static DepartmentResponse toResponse(Department department){

        return DepartmentResponse.builder()

                .id(department.getId())

                .departmentName(department.getDepartmentName())

                .departmentCode(department.getDepartmentCode())

                .description(department.getDescription())

                .active(department.getActive())

                .build();

    }

}