package com.greensteel.esg.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnvironmentalResponse {

    private Double environmentalScore;

    private Double carbonFootprint;

    private Double waterEfficiency;

    private Double wasteRecycling;

    private Double renewableEnergy;

}