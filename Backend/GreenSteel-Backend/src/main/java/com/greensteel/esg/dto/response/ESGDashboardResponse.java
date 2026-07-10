package com.greensteel.esg.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ESGDashboardResponse {

    private Double environmentalScore;

    private Double socialScore;

    private Double governanceScore;

    private Double overallScore;

    private EnvironmentalResponse environmental;

    private SocialResponse social;

    private GovernanceResponse governance;

    private PlantOverviewResponse plantOverview;

    private List<RecentActivityResponse> recentActivities;

}