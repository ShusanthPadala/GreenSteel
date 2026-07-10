package com.greensteel.esg.service.impl;

import com.greensteel.alert.repository.AlertRepository;
import com.greensteel.common.enums.UnitStatus;
import com.greensteel.emissionrecord.repository.EmissionRecordRepository;
import com.greensteel.esg.dto.request.UpdateESGMetricRequest;
import com.greensteel.esg.dto.response.*;
import com.greensteel.esg.repository.ESGMetricRepository;
import com.greensteel.esg.service.ESGService;
import com.greensteel.esg.util.ESGScoreCalculator;
import com.greensteel.report.repository.ReportRepository;
import com.greensteel.unit.repository.UnitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.greensteel.esg.dto.response.EnvironmentalAlertResponse;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ESGServiceImpl implements ESGService {

    private final UnitRepository unitRepository;

    private final AlertRepository alertRepository;

    private final ReportRepository reportRepository;

    private final EmissionRecordRepository emissionRecordRepository;


    private final ESGMetricRepository metricRepository;

    private double getMetric(String name) {
        return metricRepository.findByMetricName(name)
                .map(metric -> metric.getMetricValue())
                .orElse(0.0);
    }

    @Override
    public ESGDashboardResponse getDashboard() {

        EnvironmentalResponse environmental = getEnvironmentalMetrics();

        SocialResponse social = getSocialMetrics();

        GovernanceResponse governance = getGovernanceMetrics();

        double overall = ESGScoreCalculator.calculateOverallScore(
                environmental.getEnvironmentalScore(),
                social.getSocialScore(),
                governance.getGovernanceScore()
        );

        return ESGDashboardResponse.builder()
                .environmentalScore(environmental.getEnvironmentalScore())
                .socialScore(social.getSocialScore())
                .governanceScore(governance.getGovernanceScore())
                .overallScore(overall)
                .environmental(environmental)
                .social(social)
                .governance(governance)
                .plantOverview(getPlantOverview())
                .recentActivities(getRecentActivities())
                .build();

    }

    @Override
    public EnvironmentalResponse getEnvironmentalMetrics() {

        Double carbon = emissionRecordRepository.getAverageHealthScore();

        if (carbon == null) {
            carbon = 0.0;
        }

        double water = getMetric("Water Efficiency");

        double recycling = getMetric("Waste Recycling");

        double renewable = getMetric("Renewable Energy");

        double score = ESGScoreCalculator.calculateEnvironmentalScore(
                carbon,
                water,
                recycling,
                renewable
        );


        return EnvironmentalResponse.builder()
                .environmentalScore(score)
                .carbonFootprint(carbon)
                .waterEfficiency(water)
                .wasteRecycling(recycling)
                .renewableEnergy(renewable)
                .build();
    }
    @Override
    public SocialResponse getSocialMetrics() {

        double safety = getMetric("Employee Safety");

        double training = getMetric("Training Hours");

        double score = ESGScoreCalculator.calculateSocialScore(
                safety,
                training / 100
        );

        return SocialResponse.builder()
                .socialScore(score)
                .employeeSafety(safety)
                .trainingHours(training)
                .build();
    }
    @Override
    public GovernanceResponse getGovernanceMetrics() {

        double board = getMetric("Board Compliance");

        double sustainability = getMetric("Sustainability Index");

        double score = ESGScoreCalculator.calculateGovernanceScore(
                board,
                sustainability
        );

        return GovernanceResponse.builder()
                .governanceScore(score)
                .boardCompliance(board)
                .sustainabilityIndex(sustainability)
                .build();
    }

    @Override
    public void updateMetric(Long id, UpdateESGMetricRequest request) {

    }
    private PlantOverviewResponse getPlantOverview() {

        return PlantOverviewResponse.builder()
                .totalUnits(unitRepository.count())
                .operationalUnits(unitRepository.countByStatus(UnitStatus.OPERATIONAL))
                .maintenanceUnits(unitRepository.countByStatus(UnitStatus.MAINTENANCE))
                .warningUnits(unitRepository.countByStatus(UnitStatus.WARNING))
                .blastFurnaces(4L)
                .powerPlants(2L)
                .build();
    }
    private List<RecentActivityResponse> getRecentActivities() {
        List<RecentActivityResponse> activities = new ArrayList<>();

        alertRepository.findTop5ByOrderByAlertTimeDesc()
                .forEach(alert -> activities.add(
                        RecentActivityResponse.builder()
                                .title("Alert")
                                .description(alert.getPollutant() + " detected in " + alert.getUnit().getUnitName())
                                .activityTime(alert.getAlertTime())
                                .build()
                ));

        reportRepository.findTop5ByOrderByGeneratedDateDesc()
                .forEach(report -> activities.add(
                        RecentActivityResponse.builder()
                                .title("Report")
                                .description(report.getReportName())
                                .activityTime(report.getGeneratedDate().atStartOfDay())
                                .build()
                ));

        return activities;
    }
    @Override
    public List<EnvironmentalAlertResponse> getEnvironmentalAlerts() {

        return alertRepository.findTop5ByOrderByAlertTimeDesc()
                .stream()
                .map(alert -> EnvironmentalAlertResponse.builder()
                        .unitName(alert.getUnit().getUnitName())
                        .pollutant(alert.getPollutant())
                        .value(alert.getValue())
                        .severity(alert.getSeverity())
                        .resolved(alert.isResolved())
                        .alertTime(alert.getAlertTime())
                        .build())
                .toList();
    }

}
