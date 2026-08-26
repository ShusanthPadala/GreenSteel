package com.greensteel.security;
import com.greensteel.common.response.ApiResponse;
import com.greensteel.security.dto.LoginRequest;
import com.greensteel.security.dto.LoginResponse;
import com.greensteel.security.dto.ForgotPasswordRequest;
import com.greensteel.security.dto.ResetPasswordRequest;
import com.greensteel.security.service.AuthenticationService;
import com.greensteel.security.service.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping({"/auth", "/api/auth"})
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;
    private final PasswordResetService passwordResetService;



        @PostMapping("/login")
        public ResponseEntity<ApiResponse<LoginResponse>> login(
                @Valid @RequestBody LoginRequest request) {

            System.out.println("LOGIN API HIT");

            LoginResponse response = authenticationService.login(request);

            return ResponseEntity.ok(
                    ApiResponse.<LoginResponse>builder()
                            .success(true)
                            .message("Login successful")
                            .data(response)
                            .build()

            );

        }

        @PostMapping("/forgot-password")
        public ResponseEntity<ApiResponse<Void>> forgotPassword(
                @Valid @RequestBody ForgotPasswordRequest request) {
            passwordResetService.requestReset(request.getEmail());
            return ResponseEntity.ok(ApiResponse.<Void>builder()
                    .success(true)
                    .message("If an account exists for this email, a password reset link has been sent.")
                    .data(null)
                    .build());
        }

        @PostMapping("/reset-password")
        public ResponseEntity<ApiResponse<Void>> resetPassword(
                @Valid @RequestBody ResetPasswordRequest request) {
            passwordResetService.resetPassword(request.getToken(), request.getNewPassword());
            return ResponseEntity.ok(ApiResponse.<Void>builder()
                    .success(true)
                    .message("Password reset successfully.")
                    .data(null)
                    .build());
        }

    }
