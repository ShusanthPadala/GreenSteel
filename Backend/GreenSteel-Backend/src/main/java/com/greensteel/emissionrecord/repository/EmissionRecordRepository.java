package com.greensteel.emissionrecord.repository;

import com.greensteel.emissionrecord.entity.EmissionRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface EmissionRecordRepository
        extends JpaRepository<EmissionRecord, Long> {

    List<EmissionRecord> findByUnitId(Long unitId);

    Optional<EmissionRecord> findTopByUnitIdOrderByRecordedAtDesc(Long unitId);

    List<EmissionRecord> findTop10ByOrderByRecordedAtDesc();

    List<EmissionRecord> findAllByOrderByRecordedAtAsc();

    @Query("""
        SELECT AVG(e.healthScore)
        FROM EmissionRecord e
    """)
    Double getAverageHealthScore();

}