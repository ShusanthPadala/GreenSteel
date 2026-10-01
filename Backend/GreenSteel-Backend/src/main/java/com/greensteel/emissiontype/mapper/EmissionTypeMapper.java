package com.greensteel.emissiontype.mapper;

import com.greensteel.emissiontype.dto.response.EmissionTypeResponse;
import com.greensteel.emissiontype.entity.EmissionType;
import org.springframework.stereotype.Component;

@Component
public class EmissionTypeMapper {

    public EmissionTypeResponse toResponse(EmissionType emissionType) {

        return EmissionTypeResponse.builder()
                .id(emissionType.getId())
                .emissionType(emissionType.getEmissionType())
                .unit(emissionType.getUnit())
                .description(emissionType.getDescription())
                .limitValue(emissionType.getLimitValue())
                .active(emissionType.getActive())
                .build();
    }
}