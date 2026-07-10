package com.greensteel.unit.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateUnitRequest {

    @NotBlank(message = "Unit name is required")
    private String unitName;

    @NotBlank(message = "Unit code is required")
    private String unitCode;

    @NotNull(message = "Department is required")
    private Long departmentId;

}