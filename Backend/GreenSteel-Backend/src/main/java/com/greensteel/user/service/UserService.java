package com.greensteel.user.service;

import com.greensteel.user.dto.request.CreateUserRequest;
import com.greensteel.user.dto.request.UpdateUserRequest;
import com.greensteel.user.dto.response.UserResponse;

import java.util.List;

public interface UserService {

    UserResponse createUser(CreateUserRequest request);

    UserResponse updateUser(Long id, UpdateUserRequest request);

    UserResponse getUserById(Long id);

    List<UserResponse> getAllUsers();

    void deleteUser(Long id);
}