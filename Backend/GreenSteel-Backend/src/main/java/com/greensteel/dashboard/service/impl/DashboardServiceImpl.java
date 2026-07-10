package com.greensteel.dashboard.service.impl;

import com.greensteel.dashboard.dto.response.DashboardResponse;
import com.greensteel.dashboard.dto.response.DashboardSummaryResponse;
import com.greensteel.dashboard.dto.response.TrendPointResponse;
import com.greensteel.dashboard.dto.response.UnitCardResponse;
import com.greensteel.dashboard.service.DashboardService;
import com.greensteel.department.entity.Department;
import com.greensteel.department.repository.DepartmentRepository;
import com.greensteel.emissionrecord.entity.EmissionRecord;
import com.greensteel.emissionrecord.repository.EmissionRecordRepository;
import com.greensteel.unit.entity.Unit;
import com.greensteel.unit.repository.UnitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.greensteel.common.enums.UnitStatus;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final DepartmentRepository departmentRepository;
    private final UnitRepository unitRepository;
    private final EmissionRecordRepository emissionRecordRepository;

    @Override
    public DashboardResponse getDashboard(Long departmentId) {

        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        List<Unit> units = unitRepository.findByDepartmentId(departmentId);

        List<UnitCardResponse> unitCards = new ArrayList<>();

        int operational = 0;
        int maintenance = 0;
        int warning = 0;

        double totalEfficiency = 0;
        double totalHealth = 0;
        int recordCount = 0;

        for (Unit unit : units) {

            EmissionRecord record = emissionRecordRepository
                    .findTopByUnitIdOrderByRecordedAtDesc(unit.getId())
                    .orElse(null);

            if (record == null) {
                continue;
            }

            if (unit.getStatus() == UnitStatus.OPERATIONAL) {
                operational++;
            }
            else if (unit.getStatus() == UnitStatus.MAINTENANCE) {
                maintenance++;
            }
            else if (unit.getStatus() == UnitStatus.WARNING) {
                warning++;
            }

            totalEfficiency += record.getEfficiency();
            totalHealth += record.getHealthScore();
            recordCount++;

            unitCards.add(

                    UnitCardResponse.builder()

                            .unitId(unit.getId())

                            .unitName(unit.getUnitName())

                            .status(unit.getStatus().name())

                            .healthScore(record.getHealthScore())

                            .cox(record.getCox())

                            .nox(record.getNox())

                            .sox(record.getSox())

                            .pm(record.getPm())

                            .flyAsh(record.getFlyAsh())

                            .temperature(record.getTemperature())

                            .efficiency(record.getEfficiency())

                            .build()

            );
        }

        return DashboardResponse.builder()

                .departmentName(department.getDepartmentName())

                .operational(operational)

                .maintenance(maintenance)

                .warning(warning)

                .averageEfficiency(
                        recordCount == 0 ? 0 : totalEfficiency / recordCount)

                .averageHealthScore(
                        recordCount == 0 ? 0 : totalHealth / recordCount)

                .units(unitCards)

                .build();
    }
    @Override
    public DashboardSummaryResponse getSummary() {

        var records = emissionRecordRepository.findAll();
        var units = unitRepository.findAll();

        double totalCOx = 0;
        double totalNOx = 0;
        double totalSOx = 0;
        double totalPM = 0;

        double totalHealth = 0;
        double totalEfficiency = 0;

        for (EmissionRecord record : records) {

            totalCOx += record.getCox();
            totalNOx += record.getNox();
            totalSOx += record.getSox();
            totalPM += record.getPm();

            totalHealth += record.getHealthScore();
            totalEfficiency += record.getEfficiency();
        }

        int operational = 0;
        int maintenance = 0;
        int warning = 0;

        for (var unit : units) {

            switch (unit.getStatus()) {

                case OPERATIONAL -> operational++;

                case MAINTENANCE -> maintenance++;

                case WARNING -> warning++;
            }
        }

        double avgHealth =
                records.isEmpty() ? 0 : totalHealth / records.size();

        double avgEfficiency =
                records.isEmpty() ? 0 : totalEfficiency / records.size();

        return DashboardSummaryResponse.builder()
                .totalCOx(totalCOx)
                .totalNOx(totalNOx)
                .totalSOx(totalSOx)
                .totalPM(totalPM)
                .esgScore(avgHealth)
                .sustainabilityScore(avgEfficiency)
                .operationalUnits(operational)
                .maintenanceUnits(maintenance)
                .warningUnits(warning)
                .build();
    }
    @Override
    public List<TrendPointResponse> getEmissionTrends() {

        List<TrendPointResponse> trends = new ArrayList<>();

        String[] months = {
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun"
        };

        List<EmissionRecord> records =
                emissionRecordRepository.findAll();

        for (int i = 0; i < months.length; i++) {

            if (i < records.size()) {

                EmissionRecord r = records.get(i);

                trends.add(

                        TrendPointResponse.builder()
                                .month(months[i])
                                .cox(r.getCox())
                                .nox(r.getNox())
                                .sox(r.getSox())
                                .pm(r.getPm())
                                .build()

                );

            } else {

                trends.add(

                        TrendPointResponse.builder()
                                .month(months[i])
                                .cox(0.0)
                                .nox(0.0)
                                .sox(0.0)
                                .pm(0.0)
                                .build()

                );

            }

        }

        return trends;
    }
}