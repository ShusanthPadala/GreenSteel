package com.greensteel.emissiontype.service;

import com.greensteel.emissiontype.dto.request.CreateEmissionTypeRequest;
import com.greensteel.emissiontype.dto.request.UpdateEmissionTypeRequest;
import com.greensteel.emissiontype.dto.response.EmissionTypeResponse;

import java.util.List;

public interface EmissionTypeService {

    EmissionTypeResponse createEmissionType(CreateEmissionTypeRequest request);

    EmissionTypeResponse updateEmissionType(
            Long id,
            UpdateEmissionTypeRequest request);

    EmissionTypeResponse getEmissionTypeById(Long id);

    List<EmissionTypeResponse> getAllEmissionTypes();

    void deleteEmissionType(Long id);
}