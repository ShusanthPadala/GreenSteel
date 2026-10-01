package com.greensteel.alert.controller;

import com.greensteel.alert.dto.response.AlertResponse;
import com.greensteel.alert.service.AlertService;
import com.greensteel.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alerts")
@RequiredArgsConstructor
public class AlertController {

    private final AlertService alertService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AlertResponse>>> getActiveAlerts() {

        return ResponseEntity.ok(

                ApiResponse.<List<AlertResponse>>builder()
                        .success(true)
                        .message("Alerts Loaded Successfully")
                        .data(alertService.getActiveAlerts())
                        .build()

        );
    }

    /** Close an alert once the cause has been dealt with. */
    @PutMapping("/{id}/resolve")
    @PreAuthorize("@access.can('alerts', 'resolve')")
    public ResponseEntity<ApiResponse<AlertResponse>> resolveAlert(@PathVariable Long id) {

        return ResponseEntity.ok(

                ApiResponse.<AlertResponse>builder()
                        .success(true)
                        .message("Alert resolved")
                        .data(alertService.resolveAlert(id))
                        .build()

        );
    }
}