package com.greensteel.unit.dto.request;

import com.greensteel.common.enums.UnitStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateUnitRequest {

    @NotBlank(message = "Unit name is required")
    private String unitName;

    @NotBlank(message = "Unit code is required")
    private String unitCode;

    @NotNull(message = "Department is required")
    private Long departmentId;

    @NotNull(message = "Status is required")
    private UnitStatus status;

    @NotNull(message = "Active status is required")
    private Boolean active;
}