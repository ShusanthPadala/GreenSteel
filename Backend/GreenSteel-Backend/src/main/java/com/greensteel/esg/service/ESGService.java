package com.greensteel.esg.service;

import com.greensteel.esg.dto.request.UpdateESGMetricRequest;
import com.greensteel.esg.dto.response.*;
import java.util.List;

public interface ESGService {

    ESGDashboardResponse getDashboard();

    EnvironmentalResponse getEnvironmentalMetrics();

    SocialResponse getSocialMetrics();

    GovernanceResponse getGovernanceMetrics();

    void updateMetric(Long id, UpdateESGMetricRequest request);

    List<EnvironmentalAlertResponse> getEnvironmentalAlerts();

}