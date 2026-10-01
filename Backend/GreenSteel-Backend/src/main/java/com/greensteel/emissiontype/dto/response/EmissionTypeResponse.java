package com.greensteel.emissiontype.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmissionTypeResponse {

    private Long id;

    private String emissionType;

    private String unit;

    private String description;

    private Double limitValue;

    private Boolean active;
}