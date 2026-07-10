package com.greensteel.alert.mapper;

import com.greensteel.alert.dto.response.AlertResponse;
import com.greensteel.alert.entity.Alert;

public class AlertMapper {

    private AlertMapper() {
    }

    public static AlertResponse toResponse(Alert alert) {

        return AlertResponse.builder()
                .id(alert.getId())
                .unitId(alert.getUnit().getId())
                .unitName(alert.getUnit().getUnitName())
                .pollutant(alert.getPollutant())
                .value(alert.getValue())
                .severity(alert.getSeverity())
                .alertTime(alert.getAlertTime())
                .resolved(alert.isResolved())
                .build();
    }

}