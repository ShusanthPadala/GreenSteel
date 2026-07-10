package com.greensteel.dashboard.controller;

import com.greensteel.common.response.ApiResponse;
import com.greensteel.dashboard.dto.response.DashboardResponse;
import com.greensteel.dashboard.dto.response.DashboardSummaryResponse;
import com.greensteel.dashboard.dto.response.TrendPointResponse;
import com.greensteel.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/{departmentId}")
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard(
            @PathVariable Long departmentId) {

        DashboardResponse response =
                dashboardService.getDashboard(departmentId);

        return ResponseEntity.ok(
                ApiResponse.<DashboardResponse>builder()
                        .success(true)
                        .message("Dashboard Loaded Successfully")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/summary")
    public DashboardSummaryResponse getSummary() {
        return dashboardService.getSummary();
    }
    @GetMapping("/trends")
    public ResponseEntity<ApiResponse<List<TrendPointResponse>>> getTrends() {

        return ResponseEntity.ok(

                ApiResponse.<List<TrendPointResponse>>builder()
                        .success(true)
                        .message("Emission Trends Loaded Successfully")
                        .data(dashboardService.getEmissionTrends())
                        .build()

        );

    }
}