package com.greensteel.alert.repository;

import com.greensteel.alert.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AlertRepository extends JpaRepository<Alert, Long> {

    List<Alert> findByResolvedFalse();

    List<Alert> findTop5ByOrderByAlertTimeDesc();

    /** The open alert (if any) for a unit + pollutant, so repeat breaches update it instead of piling up. */
    Optional<Alert> findFirstByUnitIdAndPollutantAndResolvedFalse(Long unitId, String pollutant);
}