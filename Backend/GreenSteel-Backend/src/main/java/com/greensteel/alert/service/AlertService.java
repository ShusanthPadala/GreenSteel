package com.greensteel.alert.service;

import com.greensteel.alert.dto.response.AlertResponse;
import com.greensteel.emissionrecord.entity.EmissionRecord;

import java.util.List;

public interface AlertService {

    List<AlertResponse> getActiveAlerts();

    /** Mark an alert as resolved (department engineers: own department only). */
    AlertResponse resolveAlert(Long id);

    /** Raise or update alerts for any pollutant in this reading that is at or over its limit. */
    void evaluate(EmissionRecord record);

}