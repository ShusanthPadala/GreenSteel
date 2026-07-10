package com.greensteel.emissionrecord.service;

import com.greensteel.emissionrecord.dto.request.CreateEmissionRecordRequest;
import com.greensteel.emissionrecord.dto.request.UpdateEmissionRecordRequest;
import com.greensteel.emissionrecord.dto.response.EmissionRecordResponse;

import java.util.List;

public interface EmissionRecordService {

    EmissionRecordResponse createEmissionRecord(CreateEmissionRecordRequest request);

    List<EmissionRecordResponse> getAllEmissionRecords();

    EmissionRecordResponse getEmissionRecordById(Long id);

    List<EmissionRecordResponse> getEmissionRecordsByUnit(Long unitId);

    EmissionRecordResponse updateEmissionRecord(
            Long id,
            UpdateEmissionRecordRequest request
    );

    void deleteEmissionRecord(Long id);

}