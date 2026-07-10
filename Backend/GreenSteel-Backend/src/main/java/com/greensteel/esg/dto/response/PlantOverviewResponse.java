package com.greensteel.esg.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlantOverviewResponse {

    private Long blastFurnaces;

    private Long powerPlants;

    private Long operationalUnits;

    private Long maintenanceUnits;

    private Long warningUnits;

    private Long totalUnits;

}