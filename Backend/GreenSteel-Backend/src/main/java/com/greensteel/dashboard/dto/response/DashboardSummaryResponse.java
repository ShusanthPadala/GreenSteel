package com.greensteel.dashboard.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryResponse {

    // Environmental KPIs

    private Double averageCOx;

    private Double averageNOx;

    private Double averageSOx;

    private Double averagePM;

    // Overall Scores

    private Double esgScore;

    private Double sustainabilityScore;

    // Plant Status

    private Integer operationalUnits;

    private Integer maintenanceUnits;

    private Integer warningUnits;

    // Quick Dashboard KPI

    private Integer totalUnits;

}