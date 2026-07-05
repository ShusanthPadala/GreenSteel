package com.greensteel.user.dto.response;
import com.greensteel.common.enums.UserStatus;
import lombok.*;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private Long id;

    private String employeeCode;

    private String firstName;

    private String lastName;

    private String email;

    private String phone;

    private String departmentName;

    private String roleName;

    private UserStatus status;
}