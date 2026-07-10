package com.greensteel.alert.repository;

import com.greensteel.alert.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {

    List<Alert> findByResolvedFalse();

    List<Alert> findTop5ByOrderByAlertTimeDesc();
}