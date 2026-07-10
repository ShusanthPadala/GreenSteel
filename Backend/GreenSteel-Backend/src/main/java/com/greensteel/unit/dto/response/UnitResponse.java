package com.greensteel.unit.dto.response;

import com.greensteel.common.enums.UnitStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UnitResponse {

    private Long id;

    private String unitName;

    private String unitCode;

    private Long departmentId;

    private String departmentName;

    private UnitStatus status;

    private Boolean active;
}