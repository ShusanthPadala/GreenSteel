package com.greensteel.emissiontype.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateEmissionTypeRequest {

    @NotBlank
    private String emissionType;

    @NotBlank
    private String unit;

    private String description;

    @Positive(message = "Emission limit must be greater than 0")
    private Double limitValue;
}