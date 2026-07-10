package com.greensteel.dashboard.dto.response;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {

    private String departmentName;

    private Integer operational;

    private Integer maintenance;

    private Integer warning;

    private Double averageEfficiency;

    private Double averageHealthScore;

    private List<UnitCardResponse> units;

}