package com.greensteel.unit.controller;

import com.greensteel.common.response.ApiResponse;
import com.greensteel.unit.dto.request.CreateUnitRequest;
import com.greensteel.unit.dto.request.UpdateUnitRequest;
import com.greensteel.unit.dto.response.UnitResponse;
import com.greensteel.unit.service.UnitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/units")
@RequiredArgsConstructor
public class UnitController {

    private final UnitService unitService;

    @PostMapping
    @PreAuthorize("@access.can('units', 'create')")
    public ResponseEntity<ApiResponse<UnitResponse>> createUnit(
            @Valid @RequestBody CreateUnitRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<UnitResponse>builder()
                        .success(true)
                        .message("Unit created successfully")
                        .data(unitService.createUnit(request))
                        .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UnitResponse>>> getAllUnits() {

        return ResponseEntity.ok(
                ApiResponse.<List<UnitResponse>>builder()
                        .success(true)
                        .message("Units fetched successfully")
                        .data(unitService.getAllUnits())
                        .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UnitResponse>> getUnitById(@PathVariable Long id) {

        return ResponseEntity.ok(
                ApiResponse.<UnitResponse>builder()
                        .success(true)
                        .message("Unit fetched successfully")
                        .data(unitService.getUnitById(id))
                        .build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("@access.can('units', 'edit')")
    public ResponseEntity<ApiResponse<UnitResponse>> updateUnit(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUnitRequest request) {

        return ResponseEntity.ok(
                ApiResponse.<UnitResponse>builder()
                        .success(true)
                        .message("Unit updated successfully")
                        .data(unitService.updateUnit(id, request))
                        .build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@access.can('units', 'delete')")
    public ResponseEntity<ApiResponse<Void>> deleteUnit(@PathVariable Long id) {

        unitService.deleteUnit(id);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Unit deleted successfully")
                        .data(null)
                        .build());
    }
}