package com.greensteel.esg.repository;

import com.greensteel.esg.entity.ESGMetric;
import com.greensteel.esg.enums.MetricCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ESGMetricRepository extends JpaRepository<ESGMetric, Long> {

    List<ESGMetric> findByCategory(MetricCategory category);

    Optional<ESGMetric> findByMetricName(String metricName);

}