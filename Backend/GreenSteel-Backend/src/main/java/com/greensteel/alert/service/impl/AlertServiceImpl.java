package com.greensteel.alert.service.impl;

import com.greensteel.alert.dto.response.AlertResponse;
import com.greensteel.alert.mapper.AlertMapper;
import com.greensteel.alert.repository.AlertRepository;
import com.greensteel.alert.service.AlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AlertServiceImpl implements AlertService {

    private final AlertRepository alertRepository;

    @Override
    public List<AlertResponse> getActiveAlerts() {

        return alertRepository.findByResolvedFalse()
                .stream()
                .map(AlertMapper::toResponse)
                .toList();
    }
}