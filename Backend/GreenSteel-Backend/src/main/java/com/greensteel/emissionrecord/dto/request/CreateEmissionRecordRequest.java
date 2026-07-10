package com.greensteel.emissionrecord.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateEmissionRecordRequest {

    @NotNull
    private Long unitId;

    @NotNull
    private Double cox;

    @NotNull
    private Double nox;

    @NotNull
    private Double sox;

    @NotNull
    private Double pm;

    @NotNull
    private Double flyAsh;

    @NotNull
    private Double temperature;

    @NotNull
    private Double efficiency;

    @NotNull
    private Double healthScore;

    @NotNull
    private String status;

}