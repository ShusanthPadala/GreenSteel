package com.greensteel.emissiontype.controller;

import com.greensteel.common.response.ApiResponse;
import com.greensteel.emissiontype.dto.request.CreateEmissionTypeRequest;
import com.greensteel.emissiontype.dto.request.UpdateEmissionTypeRequest;
import com.greensteel.emissiontype.dto.response.EmissionTypeResponse;
import com.greensteel.emissiontype.service.EmissionTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/emission-types")
@RequiredArgsConstructor
public class EmissionTypeController {

    private final EmissionTypeService emissionTypeService;

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<EmissionTypeResponse>> createEmissionType(
            @Valid @RequestBody CreateEmissionTypeRequest request) {

        EmissionTypeResponse response =
                emissionTypeService.createEmissionType(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        ApiResponse.<EmissionTypeResponse>builder()
                                .success(true)
                                .message("Emission Type created successfully")
                                .data(response)
                                .build()
                );
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<EmissionTypeResponse>>> getAllEmissionTypes() {

        List<EmissionTypeResponse> response =
                emissionTypeService.getAllEmissionTypes();

        return ResponseEntity.ok(
                ApiResponse.<List<EmissionTypeResponse>>builder()
                        .success(true)
                        .message("Emission Types fetched successfully")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<EmissionTypeResponse>> getEmissionTypeById(
            @PathVariable Long id) {

        EmissionTypeResponse response =
                emissionTypeService.getEmissionTypeById(id);

        return ResponseEntity.ok(
                ApiResponse.<EmissionTypeResponse>builder()
                        .success(true)
                        .message("Emission Type fetched successfully")
                        .data(response)
                        .build()
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<EmissionTypeResponse>> updateEmissionType(
            @PathVariable Long id,
            @Valid @RequestBody UpdateEmissionTypeRequest request) {

        EmissionTypeResponse response =
                emissionTypeService.updateEmissionType(id, request);

        return ResponseEntity.ok(
                ApiResponse.<EmissionTypeResponse>builder()
                        .success(true)
                        .message("Emission Type updated successfully")
                        .data(response)
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteEmissionType(
            @PathVariable Long id) {

        emissionTypeService.deleteEmissionType(id);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Emission Type deleted successfully")
                        .data(null)
                        .build()
        );
    }
}