package com.greensteel.user.controller;

import com.greensteel.common.response.ApiResponse;
import com.greensteel.user.dto.request.CreateUserRequest;
import com.greensteel.user.dto.request.UpdateUserRequest;
import com.greensteel.user.dto.response.UserResponse;
import com.greensteel.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

  @PostMapping
  public ResponseEntity<ApiResponse<UserResponse>> createUser(
          @Valid @RequestBody CreateUserRequest request) {

      UserResponse response = userService.createUser(request);

      return ResponseEntity.status(HttpStatus.CREATED)
              .body(
                      ApiResponse.<UserResponse>builder()
                              .success(true)
                              .message("User created successfully")
                              .data(response)
                              .build()
              );
  }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {

        List<UserResponse> users = userService.getAllUsers();

        return ResponseEntity.ok(
                ApiResponse.<List<UserResponse>>builder()
                        .success(true)
                        .message("Users fetched successfully")
                        .data(users)
                        .build()
        );
    }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable("id") Long id,
            @Valid @RequestBody UpdateUserRequest request) {

        UserResponse response = userService.updateUser(id, request);

        return ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                        .success(true)
                        .message("User updated successfully")
                        .data(response)
                        .build()
        );
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable("id") Long id) {

        userService.deleteUser(id);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("User deleted successfully")
                        .data(null)
                        .build()
        );

    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable("id") Long id) {

        UserResponse response = userService.getUserById(id);

        return ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                        .success(true)
                        .message("User fetched successfully")
                        .data(response)
                        .build()
        );
    }
}






// @GetMapping
//public List<UserResponse> getAllUsers() {
//  return userService.getAllUsers();
//}

//  @GetMapping("/{id}")
//  public UserResponse getUserById(@PathVariable Long id) {
//
//      return userService.getUserById(id);
//
//  }
//  @PutMapping("/{id}")
//  public UserResponse updateUser(
//          @PathVariable Long id,
//          @Valid @RequestBody UpdateUserRequest request) {
//
//      return userService.updateUser(id, request);
//  }
//  @DeleteMapping("/{id}")
//  public void deleteUser(@PathVariable Long id) {
//
//      userService.deleteUser(id);
//
//  }