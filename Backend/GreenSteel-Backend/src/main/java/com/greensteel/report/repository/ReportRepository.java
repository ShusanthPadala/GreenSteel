package com.greensteel.report.repository;

import com.greensteel.report.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report,Long> {

    List<Report> findTop5ByOrderByGeneratedDateDesc();
    
}