package com.greensteel.report.mapper;

import com.greensteel.report.dto.response.ReportResponse;
import com.greensteel.report.entity.Report;
import org.springframework.stereotype.Component;

@Component
public class ReportMapper {

    public ReportResponse toResponse(Report report) {

        return ReportResponse.builder()
                .id(report.getId())
                .reportName(report.getReportName())
                .reportType(report.getReportType())
                .format(report.getFormat())
                .generatedDate(report.getGeneratedDate())
                .status(report.getStatus())
                .build();
    }

}