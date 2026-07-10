package com.greensteel.unit.service;

import com.greensteel.unit.dto.request.CreateUnitRequest;
import com.greensteel.unit.dto.request.UpdateUnitRequest;
import com.greensteel.unit.dto.response.UnitResponse;

import java.util.List;

public interface UnitService {

    UnitResponse createUnit(CreateUnitRequest request);

    UnitResponse updateUnit(Long id, UpdateUnitRequest request);

    UnitResponse getUnitById(Long id);

    List<UnitResponse> getAllUnits();

    void deleteUnit(Long id);

}