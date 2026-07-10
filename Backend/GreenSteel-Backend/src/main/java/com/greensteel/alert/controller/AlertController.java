package com.greensteel.alert.controller;

import com.greensteel.alert.dto.response.AlertResponse;
import com.greensteel.alert.service.AlertService;
import com.greensteel.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
}