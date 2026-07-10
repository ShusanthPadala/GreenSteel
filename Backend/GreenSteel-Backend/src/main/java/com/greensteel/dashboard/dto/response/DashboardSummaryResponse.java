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

    private Double totalCOx;
    private Double totalNOx;
    private Double totalSOx;
    private Double totalPM;

    private Double esgScore;
    private Double sustainabilityScore;

    private Integer operationalUnits;
    private Integer maintenanceUnits;
    private Integer warningUnits;
}