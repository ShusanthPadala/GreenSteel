package com.greensteel.alert.service;

import com.greensteel.alert.dto.response.AlertResponse;

import java.util.List;

public interface AlertService {

    List<AlertResponse> getActiveAlerts();

}