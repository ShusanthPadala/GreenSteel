package com.greensteel.user.dto.request;

import com.greensteel.common.enums.UserStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.*;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateUserRequest {

  //  @NotBlank
  //  private String firstName;
//
  //  @NotBlank
  //  private String lastName;
//
  //  @Email
  //  @NotBlank
  //  private String email;
//
  //  @NotBlank
  //  private String phone;
//
  @NotBlank(message = "First name is required")
  private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phone;

    private Long departmentId;

    private Long roleId;

    private UserStatus status;
}