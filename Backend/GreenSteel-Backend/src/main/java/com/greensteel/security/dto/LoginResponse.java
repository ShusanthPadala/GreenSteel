package com.greensteel.security.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {

    private String token;

    private String tokenType;

    private Long userId;

    private String employeeCode;

    private String firstName;

    private String lastName;

    private String email;

    private String role;

    private String department;
}