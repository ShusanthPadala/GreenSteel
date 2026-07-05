package com.greensteel.user.service.impl;

import com.greensteel.department.repository.DepartmentRepository;
import com.greensteel.role.repository.RoleRepository;
import com.greensteel.user.dto.request.CreateUserRequest;
import com.greensteel.user.dto.request.UpdateUserRequest;
import com.greensteel.user.dto.response.UserResponse;
import com.greensteel.user.repository.UserRepository;
import com.greensteel.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    private final DepartmentRepository departmentRepository;

    private final RoleRepository roleRepository;
    @Override
    public UserResponse createUser(CreateUserRequest request) {
        return null;
    }

    @Override
    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        return null;
    }

    @Override
    public UserResponse getUserById(Long id) {
        return null;
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return List.of();
    }

    @Override
    public void deleteUser(Long id) {

    }
}