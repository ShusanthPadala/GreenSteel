package com.greensteel.report.service;

import com.greensteel.report.dto.request.CreateReportRequest;
import com.greensteel.report.dto.request.UpdateReportRequest;
import com.greensteel.report.dto.response.ReportResponse;

import java.util.List;

public interface ReportService {

    ReportResponse createReport(CreateReportRequest request);

    List<ReportResponse> getAllReports();

    ReportResponse getReportById(Long id);

    ReportResponse updateReport(Long id, UpdateReportRequest request);

    void deleteReport(Long id);

}