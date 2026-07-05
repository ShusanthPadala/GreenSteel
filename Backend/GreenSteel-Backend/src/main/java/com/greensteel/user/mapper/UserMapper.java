package com.greensteel.user.mapper;

import com.greensteel.user.dto.response.UserResponse;
import com.greensteel.user.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(User user){

        return UserResponse.builder()
                .id(user.getId())
                .employeeCode(user.getEmployeeCode())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .status(user.getStatus())
                .departmentName(user.getDepartment().getDepartmentName())
                .roleName(user.getRole().getRoleName())
                .build();

    }

}