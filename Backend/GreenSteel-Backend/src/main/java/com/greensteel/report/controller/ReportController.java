package com.greensteel.report.controller;

import com.greensteel.common.response.ApiResponse;
import com.greensteel.report.dto.request.CreateReportRequest;
import com.greensteel.report.dto.request.UpdateReportRequest;
import com.greensteel.report.dto.response.ReportResponse;
import com.greensteel.report.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    @PreAuthorize("@access.can('reports', 'create')")
    public ResponseEntity<ApiResponse<ReportResponse>> createReport(
            @Valid @RequestBody CreateReportRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        ApiResponse.<ReportResponse>builder()
                                .success(true)
                                .message("Report created successfully")
                                .data(reportService.createReport(request))
                                .build()
                );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ReportResponse>>> getAllReports() {

        return ResponseEntity.ok(
                ApiResponse.<List<ReportResponse>>builder()
                        .success(true)
                        .message("Reports fetched successfully")
                        .data(reportService.getAllReports())
                        .build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ReportResponse>> getReportById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                ApiResponse.<ReportResponse>builder()
                        .success(true)
                        .message("Report fetched successfully")
                        .data(reportService.getReportById(id))
                        .build()
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("@access.can('reports', 'edit')")
    public ResponseEntity<ApiResponse<ReportResponse>> updateReport(
            @PathVariable Long id,
            @Valid @RequestBody UpdateReportRequest request) {

        return ResponseEntity.ok(
                ApiResponse.<ReportResponse>builder()
                        .success(true)
                        .message("Report updated successfully")
                        .data(reportService.updateReport(id, request))
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@access.can('reports', 'delete')")
    public ResponseEntity<ApiResponse<Void>> deleteReport(
            @PathVariable Long id) {

        reportService.deleteReport(id);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Report deleted successfully")
                        .data(null)
                        .build()
        );
    }
}