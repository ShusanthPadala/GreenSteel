package com.greensteel.security;
import com.greensteel.common.response.ApiResponse;
import com.greensteel.security.dto.LoginRequest;
import com.greensteel.security.dto.LoginResponse;
import com.greensteel.security.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


//
//import com.greensteel.common.response.ApiResponse;
//import com.greensteel.security.dto.LoginRequest;
//import com.greensteel.security.dto.LoginResponse;
//import com.greensteel.security.service.AuthenticationService;
//import jakarta.validation.Valid;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/auth")
//@RequiredArgsConstructor
//public class AuthController {
//
//    private final AuthenticationService authenticationService;
//
//    @PostMapping("/login")
//    public ResponseEntity<ApiResponse<LoginResponse>> login(
//            @Valid @RequestBody LoginRequest request) {
//
//        LoginResponse response = authenticationService.login(request);
//
//        return ResponseEntity.ok(
//                ApiResponse.<LoginResponse>builder()
//                        .success(true)
//                        .message("Login successful")
//                        .data(response)
//                        .build()
//        );
//    }
//}
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;
    

   // @PostMapping("/login")
   // public ResponseEntity<ApiResponse<LoginResponse>> login(
   //         @Valid @RequestBody LoginRequest request) {
//
   //     LoginResponse response = authenticationService.login(request);
//
   //     return ResponseEntity.ok(
   //             ApiResponse.<LoginResponse>builder()
   //                     .success(true)
   //                     .message("Login successful")
   //                     .data(response)
   //                     .build()
   //     );
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

    }

