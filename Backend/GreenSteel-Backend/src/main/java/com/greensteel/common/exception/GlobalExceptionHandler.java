package com.greensteel.common.exception;

import com.greensteel.common.response.ApiResponse;

import io.micrometer.common.lang.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;
//
//@RestControllerAdvice
//public class GlobalExceptionHandler {
//
//    @ExceptionHandler(ResourceNotFoundException.class)
//    public ResponseEntity<Map<String, String>> handleResourceNotFound(ResourceNotFoundException ex) {
//
//        return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                .body(Map.of("message", ex.getMessage()));
//
//    }
//
//    @ExceptionHandler(DuplicateResourceException.class)
//    public ResponseEntity<Map<String, String>> handleDuplicateResource(DuplicateResourceException ex) {
//
//        return ResponseEntity.status(HttpStatus.CONFLICT)
//                .body(Map.of("message", ex.getMessage()));
//
//    }
//
//}
//
//
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleResourceNotFound(ResourceNotFoundException ex) {

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(
                        ApiResponse.<Void>builder()
                                .success(false)
                                .message(ex.getMessage())
                                .data(null)
                                .build()
                );
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiResponse<Void>> handleDuplicateResource(@NonNull DuplicateResourceException ex) {

        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(
                        ApiResponse.<Void>builder()
                                .success(false)
                                .message(ex.getMessage())
                                .data(null)
                                .build()
                );
    }
   // @ExceptionHandler(MethodArgumentNotValidException.class)
   // public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationExceptions(
   //         MethodArgumentNotValidException ex) {
//
   //     Map<String, String> errors = new HashMap<>();
//
   //     ex.getBindingResult().getFieldErrors().forEach(error ->
   //             errors.put(error.getField(), error.getDefaultMessage()));
//
   //     ApiResponse<Map<String, String>> response = ApiResponse.<Map<String, String>>builder()
   //             .success(false)
   //             .message("Validation Failed")
   //             .data(errors)
   //             .build();
//
   //     return ResponseEntity.badRequest().body(response);
   // }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage()));

        ApiResponse<Map<String, String>> response = ApiResponse.<Map<String, String>>builder()
                .success(false)
                .message("Validation Failed")
                .data(errors)
                .build();

        return ResponseEntity.badRequest().body(response);
    }
}