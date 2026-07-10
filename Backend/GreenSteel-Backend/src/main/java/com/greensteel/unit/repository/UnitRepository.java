package com.greensteel.unit.repository;

import com.greensteel.common.enums.UnitStatus;
import com.greensteel.unit.entity.Unit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UnitRepository extends JpaRepository<Unit, Long> {

    List<Unit> findByDepartmentId(Long departmentId);

    boolean existsByUnitCode(String unitCode);

    long countBy();

    long countByStatus(UnitStatus status);
}