package com.greensteel.emissionrecord.mapper;

import com.greensteel.emissionrecord.dto.response.EmissionRecordResponse;
import com.greensteel.emissionrecord.entity.EmissionRecord;
import org.springframework.stereotype.Component;

@Component
public class EmissionRecordMapper {

    public EmissionRecordResponse toResponse(EmissionRecord record){

        return EmissionRecordResponse.builder()

                .id(record.getId())

                .unitId(record.getUnit().getId())

                .unitName(record.getUnit().getUnitName())

                .cox(record.getCox())

                .nox(record.getNox())

                .sox(record.getSox())

                .pm(record.getPm())

                .flyAsh(record.getFlyAsh())

                .temperature(record.getTemperature())

                .efficiency(record.getEfficiency())

                .healthScore(record.getHealthScore())

                .status(record.getStatus())

                .recordedAt(record.getRecordedAt())

                .build();

    }

}