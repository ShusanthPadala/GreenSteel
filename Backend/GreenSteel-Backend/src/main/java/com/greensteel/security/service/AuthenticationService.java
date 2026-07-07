package com.greensteel.security.service;

import com.greensteel.security.dto.LoginRequest;
import com.greensteel.security.dto.LoginResponse;
import com.greensteel.security.jwt.JwtService;
import com.greensteel.security.userdetails.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public LoginResponse login(LoginRequest request) {

        try {

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            System.out.println("Authentication successful");

            CustomUserDetails userDetails =
                    (CustomUserDetails) authentication.getPrincipal();

            String token = jwtService.generateToken(userDetails);

            return LoginResponse.builder()
                    .token(token)
                    .tokenType("Bearer")
                    .userId(userDetails.getUser().getId())
                    .employeeCode(userDetails.getUser().getEmployeeCode())
                    .firstName(userDetails.getUser().getFirstName())
                    .lastName(userDetails.getUser().getLastName())
                    .email(userDetails.getUser().getEmail())
                    .role(userDetails.getUser().getRole().getRoleName())
                    .department(userDetails.getUser().getDepartment().getDepartmentName())
                    .build();

        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

   // public LoginResponse login(LoginRequest request) {
//
   //     Authentication authentication = authenticationManager.authenticate(
   //             new UsernamePasswordAuthenticationToken(
   //                     request.getEmail(),
   //                     request.getPassword()
   //             )
   //     );
//
   //     CustomUserDetails userDetails =
   //             (CustomUserDetails) authentication.getPrincipal();
//
   //     String token = jwtService.generateToken(userDetails);
//
   //     return LoginResponse.builder()
   //             .token(token)
   //             .tokenType("Bearer")
   //             .userId(userDetails.getUser().getId())
   //             .employeeCode(userDetails.getUser().getEmployeeCode())
   //             .firstName(userDetails.getUser().getFirstName())
   //             .lastName(userDetails.getUser().getLastName())
   //             .email(userDetails.getUser().getEmail())
   //             .role(userDetails.getUser().getRole().getRoleName())
   //             .department(userDetails.getUser().getDepartment().getDepartmentName())
   //             .build();
   // }
}