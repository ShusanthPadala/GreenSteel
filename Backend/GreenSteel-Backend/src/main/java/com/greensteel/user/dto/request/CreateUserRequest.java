package com.greensteel.user.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateUserRequest {

  //  @NotBlank
  //  private String employeeCode;
//
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
  //  @NotBlank
  //  private String password;
//
   private Long departmentId;

    private Long roleId;
  @NotBlank(message = "Employee code is required")
  private String employeeCode;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Password is required")
    private String password;
}