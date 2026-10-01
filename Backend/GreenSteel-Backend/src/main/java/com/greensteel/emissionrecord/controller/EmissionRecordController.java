package com.greensteel.emissionrecord.controller;

import com.greensteel.common.response.ApiResponse;
import com.greensteel.emissionrecord.dto.request.CreateEmissionRecordRequest;
import com.greensteel.emissionrecord.dto.request.UpdateEmissionRecordRequest;
import com.greensteel.emissionrecord.dto.response.EmissionRecordResponse;
import com.greensteel.emissionrecord.service.EmissionRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/emission-records")
@RequiredArgsConstructor
public class EmissionRecordController {

    private final EmissionRecordService emissionRecordService;

    @PostMapping
    @PreAuthorize("@access.can('emission-records', 'create')")
    public ResponseEntity<ApiResponse<EmissionRecordResponse>> createEmissionRecord(
            @Valid @RequestBody CreateEmissionRecordRequest request) {

        EmissionRecordResponse response =
                emissionRecordService.createEmissionRecord(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        ApiResponse.<EmissionRecordResponse>builder()
                                .success(true)
                                .message("Emission Record Created Successfully")
                                .data(response)
                                .build()
                );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EmissionRecordResponse>>> getAllEmissionRecords() {

        return ResponseEntity.ok(
                ApiResponse.<List<EmissionRecordResponse>>builder()
                        .success(true)
                        .message("Emission Records Fetched Successfully")
                        .data(emissionRecordService.getAllEmissionRecords())
                        .build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EmissionRecordResponse>> getEmissionRecordById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                ApiResponse.<EmissionRecordResponse>builder()
                        .success(true)
                        .message("Emission Record Fetched Successfully")
                        .data(emissionRecordService.getEmissionRecordById(id))
                        .build()
        );
    }

    @GetMapping("/unit/{unitId}")
    public ResponseEntity<ApiResponse<List<EmissionRecordResponse>>> getByUnit(
            @PathVariable Long unitId) {

        return ResponseEntity.ok(
                ApiResponse.<List<EmissionRecordResponse>>builder()
                        .success(true)
                        .message("Unit Records Fetched Successfully")
                        .data(emissionRecordService.getEmissionRecordsByUnit(unitId))
                        .build()
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("@access.can('emission-records', 'edit')")
    public ResponseEntity<ApiResponse<EmissionRecordResponse>> updateEmissionRecord(
            @PathVariable Long id,
            @Valid @RequestBody UpdateEmissionRecordRequest request) {

        return ResponseEntity.ok(
                ApiResponse.<EmissionRecordResponse>builder()
                        .success(true)
                        .message("Emission Record Updated Successfully")
                        .data(emissionRecordService.updateEmissionRecord(id, request))
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@access.can('emission-records', 'delete')")
    public ResponseEntity<ApiResponse<Void>> deleteEmissionRecord(
            @PathVariable Long id) {

        emissionRecordService.deleteEmissionRecord(id);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Emission Record Deleted Successfully")
                        .data(null)
                        .build()
        );
    }
}