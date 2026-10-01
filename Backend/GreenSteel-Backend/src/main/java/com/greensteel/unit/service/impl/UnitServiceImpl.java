package com.greensteel.unit.service.impl;

import com.greensteel.common.exception.DuplicateResourceException;
import com.greensteel.common.exception.ResourceNotFoundException;
import com.greensteel.department.entity.Department;
import com.greensteel.department.repository.DepartmentRepository;
import com.greensteel.unit.dto.request.CreateUnitRequest;
import com.greensteel.unit.dto.request.UpdateUnitRequest;
import com.greensteel.unit.dto.response.UnitResponse;
import com.greensteel.unit.entity.Unit;
import com.greensteel.unit.mapper.UnitMapper;
import com.greensteel.unit.repository.UnitRepository;
import com.greensteel.unit.service.UnitService;
import com.greensteel.security.access.AccessPolicy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UnitServiceImpl implements UnitService {

    private final UnitRepository unitRepository;
    private final DepartmentRepository departmentRepository;
    private final UnitMapper unitMapper;
    private final AccessPolicy accessPolicy;

    @Override
    public UnitResponse createUnit(CreateUnitRequest request) {

        if (unitRepository.existsByUnitCode(request.getUnitCode())) {
            throw new DuplicateResourceException("Unit code already exists");
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        Unit unit = Unit.builder()
                .unitName(request.getUnitName())
                .unitCode(request.getUnitCode())
                .department(department)
                .status(com.greensteel.common.enums.UnitStatus.OPERATIONAL)
                .active(true)
                .build();

        return unitMapper.toResponse(unitRepository.save(unit));
    }

    @Override
    public UnitResponse updateUnit(Long id, UpdateUnitRequest request) {

        Unit unit = unitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Unit not found"));

        // Plant engineers: only their own department's units, and they can't move a unit elsewhere
        accessPolicy.requireDepartment(unit.getDepartment() != null ? unit.getDepartment().getId() : null);
        accessPolicy.requireDepartment(request.getDepartmentId());

        if (!unit.getUnitCode().equals(request.getUnitCode())
                && unitRepository.existsByUnitCode(request.getUnitCode())) {

            throw new DuplicateResourceException("Unit code already exists");
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        unit.setUnitName(request.getUnitName());
        unit.setUnitCode(request.getUnitCode());
        unit.setDepartment(department);
        unit.setStatus(request.getStatus());
        unit.setActive(request.getActive());

        return unitMapper.toResponse(unitRepository.save(unit));
    }

    @Override
    public UnitResponse getUnitById(Long id) {

        Unit unit = unitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Unit not found"));

        return unitMapper.toResponse(unit);
    }

    @Override
    public List<UnitResponse> getAllUnits() {

        return unitRepository.findAll()
                .stream()
                .map(unitMapper::toResponse)
                .toList();
    }

    @Override
    public void deleteUnit(Long id) {

        Unit unit = unitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Unit not found"));

        unit.setActive(false);

        unitRepository.save(unit);
    }
}