package com.greensteel.esg.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GovernanceResponse {

    private Double governanceScore;

    private Double boardCompliance;

    private Double sustainabilityIndex;

}