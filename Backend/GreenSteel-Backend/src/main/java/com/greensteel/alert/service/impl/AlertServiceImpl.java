package com.greensteel.alert.service.impl;

import com.greensteel.alert.dto.response.AlertResponse;
import com.greensteel.alert.entity.Alert;
import com.greensteel.alert.mapper.AlertMapper;
import com.greensteel.alert.repository.AlertRepository;
import com.greensteel.alert.service.AlertService;
import com.greensteel.common.exception.ResourceNotFoundException;
import com.greensteel.emissionrecord.entity.EmissionRecord;
import com.greensteel.emissiontype.service.EmissionLimitService;
import com.greensteel.security.access.AccessPolicy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AlertServiceImpl implements AlertService {

    /** A reading at or above this multiple of its limit is CRITICAL; at or above the limit, WARNING. */
    private static final double CRITICAL_RATIO = 1.25;

    private final AlertRepository alertRepository;
    private final EmissionLimitService emissionLimitService;
    private final AccessPolicy accessPolicy;

    @Override
    public List<AlertResponse> getActiveAlerts() {

        return alertRepository.findByResolvedFalse()
                .stream()
                .map(AlertMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public AlertResponse resolveAlert(Long id) {

        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found"));

        if (alert.getUnit() != null && alert.getUnit().getDepartment() != null) {
            accessPolicy.requireDepartment(alert.getUnit().getDepartment().getId());
        }

        alert.setResolved(true);

        return AlertMapper.toResponse(alertRepository.save(alert));
    }

    @Override
    @Transactional
    public void evaluate(EmissionRecord record) {

        if (record == null || record.getUnit() == null) {
            return;
        }

        Map<String, Double> limits = emissionLimitService.currentLimits();
        Map<String, Double> readings = Map.of(
                "cox", valueOrZero(record.getCox()),
                "nox", valueOrZero(record.getNox()),
                "sox", valueOrZero(record.getSox()),
                "pm", valueOrZero(record.getPm())
        );

        readings.forEach((key, value) -> {
            Double limit = limits.get(key);
            if (limit == null || limit <= 0 || value < limit) {
                return;
            }

            String pollutant = EmissionLimitService.LABELS.get(key);
            String severity = value >= limit * CRITICAL_RATIO ? "CRITICAL" : "WARNING";
            LocalDateTime when = record.getRecordedAt() != null ? record.getRecordedAt() : LocalDateTime.now();

            Alert alert = alertRepository
                    .findFirstByUnitIdAndPollutantAndResolvedFalse(record.getUnit().getId(), pollutant)
                    .orElseGet(() -> Alert.builder()
                            .unit(record.getUnit())
                            .pollutant(pollutant)
                            .resolved(false)
                            .build());

            // Keep the worst reading and escalate severity, never downgrade an open alert
            if (alert.getValue() == null || value >= alert.getValue()) {
                alert.setValue(value);
            }
            if (alert.getSeverity() == null || "CRITICAL".equals(severity)) {
                alert.setSeverity(severity);
            }
            alert.setAlertTime(when);

            alertRepository.save(alert);
        });
    }

    private static double valueOrZero(Double v) {
        return v == null ? 0.0 : v;
    }
}
