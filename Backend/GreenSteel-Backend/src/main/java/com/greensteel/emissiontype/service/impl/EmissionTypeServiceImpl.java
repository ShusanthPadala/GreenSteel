package com.greensteel.emissiontype.service.impl;

import com.greensteel.common.exception.DuplicateResourceException;
import com.greensteel.common.exception.ResourceNotFoundException;
import com.greensteel.emissiontype.dto.request.CreateEmissionTypeRequest;
import com.greensteel.emissiontype.dto.request.UpdateEmissionTypeRequest;
import com.greensteel.emissiontype.dto.response.EmissionTypeResponse;
import com.greensteel.emissiontype.entity.EmissionType;
import com.greensteel.emissiontype.mapper.EmissionTypeMapper;
import com.greensteel.emissiontype.repository.EmissionTypeRepository;
import com.greensteel.emissiontype.service.EmissionTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmissionTypeServiceImpl implements EmissionTypeService {

    private final EmissionTypeRepository emissionTypeRepository;
    private final EmissionTypeMapper emissionTypeMapper;

    @Override
    public EmissionTypeResponse createEmissionType(CreateEmissionTypeRequest request) {

        if (emissionTypeRepository.existsByEmissionType(request.getEmissionType())) {
            throw new DuplicateResourceException("Emission Type already exists");
        }

        EmissionType emissionType = EmissionType.builder()
                .emissionType(request.getEmissionType())
                .unit(request.getUnit())
                .description(request.getDescription())
                .active(true)
                .build();

        EmissionType saved = emissionTypeRepository.save(emissionType);

        return emissionTypeMapper.toResponse(saved);
    }

    @Override
    public EmissionTypeResponse updateEmissionType(
            Long id,
            UpdateEmissionTypeRequest request) {

        EmissionType emissionType = emissionTypeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Emission Type not found"));

        if (!emissionType.getEmissionType().equals(request.getEmissionType())
                && emissionTypeRepository.existsByEmissionType(request.getEmissionType())) {

            throw new DuplicateResourceException("Emission Type already exists");
        }

        emissionType.setEmissionType(request.getEmissionType());
        emissionType.setUnit(request.getUnit());
        emissionType.setDescription(request.getDescription());
        emissionType.setActive(request.getActive());

        EmissionType updated = emissionTypeRepository.save(emissionType);

        return emissionTypeMapper.toResponse(updated);
    }

    @Override
    public EmissionTypeResponse getEmissionTypeById(Long id) {

        EmissionType emissionType = emissionTypeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Emission Type not found"));

        return emissionTypeMapper.toResponse(emissionType);
    }

    @Override
    public List<EmissionTypeResponse> getAllEmissionTypes() {

        return emissionTypeRepository.findAll()
                .stream()
                .map(emissionTypeMapper::toResponse)
                .toList();
    }

    @Override
    public void deleteEmissionType(Long id) {

        EmissionType emissionType = emissionTypeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Emission Type not found"));

        emissionType.setActive(false);

        emissionTypeRepository.save(emissionType);
    }
}