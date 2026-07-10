package com.greensteel.esg.controller;

import com.greensteel.esg.dto.response.*;
import com.greensteel.esg.service.ESGService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.greensteel.esg.dto.response.EnvironmentalAlertResponse;
@RestController
@RequestMapping("/api/esg")
@RequiredArgsConstructor
public class ESGController {

    private final ESGService esgService;

    @GetMapping("/dashboard")
    public ResponseEntity<ESGDashboardResponse> getDashboard() {
        return ResponseEntity.ok(esgService.getDashboard());
    }

    @GetMapping("/environment")
    public ResponseEntity<EnvironmentalResponse> getEnvironmentalMetrics() {
        return ResponseEntity.ok(esgService.getEnvironmentalMetrics());
    }

    @GetMapping("/social")
    public ResponseEntity<SocialResponse> getSocialMetrics() {
        return ResponseEntity.ok(esgService.getSocialMetrics());
    }

    @GetMapping("/governance")
    public ResponseEntity<GovernanceResponse> getGovernanceMetrics() {
        return ResponseEntity.ok(esgService.getGovernanceMetrics());
    }
    @GetMapping("/environment-alerts")
    public ResponseEntity<List<EnvironmentalAlertResponse>> getEnvironmentalAlerts() {
        return ResponseEntity.ok(esgService.getEnvironmentalAlerts());
    }

}