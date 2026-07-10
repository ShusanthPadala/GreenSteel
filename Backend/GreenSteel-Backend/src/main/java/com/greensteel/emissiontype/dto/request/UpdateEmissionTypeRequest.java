package com.greensteel.emissiontype.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateEmissionTypeRequest {

    @NotBlank
    private String emissionType;

    @NotBlank
    private String unit;

    private String description;

    private Boolean active;
}