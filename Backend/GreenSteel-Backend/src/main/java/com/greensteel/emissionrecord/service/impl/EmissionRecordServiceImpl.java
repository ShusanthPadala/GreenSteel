package com.greensteel.emissionrecord.service.impl;

import com.greensteel.common.exception.ResourceNotFoundException;
import com.greensteel.emissionrecord.dto.request.CreateEmissionRecordRequest;
import com.greensteel.emissionrecord.dto.request.UpdateEmissionRecordRequest;
import com.greensteel.emissionrecord.dto.response.EmissionRecordResponse;
import com.greensteel.emissionrecord.entity.EmissionRecord;
import com.greensteel.emissionrecord.mapper.EmissionRecordMapper;
import com.greensteel.emissionrecord.repository.EmissionRecordRepository;
import com.greensteel.emissionrecord.service.EmissionRecordService;
import com.greensteel.unit.entity.Unit;
import com.greensteel.unit.repository.UnitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmissionRecordServiceImpl implements EmissionRecordService {

    private final EmissionRecordRepository emissionRecordRepository;

    private final UnitRepository unitRepository;

    private final EmissionRecordMapper emissionRecordMapper;

    @Override
    public EmissionRecordResponse createEmissionRecord(
            CreateEmissionRecordRequest request) {

        Unit unit = unitRepository.findById(request.getUnitId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Unit not found"));

        EmissionRecord record = EmissionRecord.builder()

                .unit(unit)

                .cox(request.getCox())

                .nox(request.getNox())

                .sox(request.getSox())

                .pm(request.getPm())

                .flyAsh(request.getFlyAsh())

                .temperature(request.getTemperature())

                .efficiency(request.getEfficiency())

                .healthScore(request.getHealthScore())

                .status(request.getStatus())

                .recordedAt(LocalDateTime.now())

                .build();

        return emissionRecordMapper.toResponse(

                emissionRecordRepository.save(record)

        );
    }

    @Override
    public List<EmissionRecordResponse> getAllEmissionRecords() {

        return emissionRecordRepository.findAll()

                .stream()

                .map(emissionRecordMapper::toResponse)

                .toList();

    }

    @Override
    public EmissionRecordResponse getEmissionRecordById(Long id) {

        EmissionRecord record = emissionRecordRepository.findById(id)

                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Emission Record not found"));

        return emissionRecordMapper.toResponse(record);

    }

    @Override
    public List<EmissionRecordResponse> getEmissionRecordsByUnit(Long unitId) {

        return emissionRecordRepository.findByUnitId(unitId)

                .stream()

                .map(emissionRecordMapper::toResponse)

                .toList();

    }

    @Override
    public EmissionRecordResponse updateEmissionRecord(
            Long id,
            UpdateEmissionRecordRequest request) {

        EmissionRecord record = emissionRecordRepository.findById(id)

                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Emission Record not found"));

        record.setCox(request.getCox());

        record.setNox(request.getNox());

        record.setSox(request.getSox());

        record.setPm(request.getPm());

        record.setFlyAsh(request.getFlyAsh());

        record.setTemperature(request.getTemperature());

        record.setEfficiency(request.getEfficiency());

        record.setHealthScore(request.getHealthScore());

        record.setStatus(request.getStatus());

        return emissionRecordMapper.toResponse(

                emissionRecordRepository.save(record)

        );

    }

    @Override
    public void deleteEmissionRecord(Long id) {

        EmissionRecord record = emissionRecordRepository.findById(id)

                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Emission Record not found"));

        emissionRecordRepository.delete(record);

    }

}