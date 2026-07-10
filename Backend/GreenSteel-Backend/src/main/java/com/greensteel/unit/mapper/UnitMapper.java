package com.greensteel.unit.mapper;

import com.greensteel.unit.dto.response.UnitResponse;
import com.greensteel.unit.entity.Unit;
import org.springframework.stereotype.Component;

@Component
public class UnitMapper {

    public UnitResponse toResponse(Unit unit) {

        return UnitResponse.builder()
                .id(unit.getId())
                .unitName(unit.getUnitName())
                .unitCode(unit.getUnitCode())
                .departmentId(unit.getDepartment().getId())
                .departmentName(unit.getDepartment().getDepartmentName())
                .status(unit.getStatus())
                .active(unit.getActive())
                .build();
    }
}