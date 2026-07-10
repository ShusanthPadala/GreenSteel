package com.greensteel.dashboard.service;

import com.greensteel.dashboard.dto.response.DashboardResponse;
import com.greensteel.dashboard.dto.response.DashboardSummaryResponse;
import com.greensteel.dashboard.dto.response.TrendPointResponse;

import java.util.List;

public interface DashboardService {

    DashboardResponse getDashboard(Long departmentId);

    DashboardSummaryResponse getSummary();

    List<TrendPointResponse> getEmissionTrends();
}