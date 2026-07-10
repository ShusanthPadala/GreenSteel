package com.greensteel.emissiontype.repository;

import com.greensteel.emissiontype.entity.EmissionType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmissionTypeRepository extends JpaRepository<EmissionType, Long> {

    boolean existsByEmissionType(String emissionType);

    Optional<EmissionType> findByEmissionType(String emissionType);

}