package com.greensteel.emissionrecord.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmissionRecordResponse {

    private Long id;

    private Long unitId;

    private String unitName;

    private Double cox;

    private Double nox;

    private Double sox;

    private Double pm;

    private Double flyAsh;

    private Double temperature;

    private Double efficiency;

    private Double healthScore;

    private String status;

    private LocalDateTime recordedAt;

}