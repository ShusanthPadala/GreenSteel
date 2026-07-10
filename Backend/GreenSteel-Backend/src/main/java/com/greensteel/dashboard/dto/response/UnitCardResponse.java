package com.greensteel.dashboard.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UnitCardResponse {

    private Long unitId;

    private String unitName;

    private String status;

    private Double healthScore;

    private Double cox;

    private Double nox;

    private Double sox;

    private Double pm;

    private Double flyAsh;

    private Double temperature;

    private Double efficiency;

}