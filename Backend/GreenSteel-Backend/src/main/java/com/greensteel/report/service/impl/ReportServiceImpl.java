package com.greensteel.report.service.impl;

import com.greensteel.common.exception.ResourceNotFoundException;
import com.greensteel.report.dto.request.CreateReportRequest;
import com.greensteel.report.dto.request.UpdateReportRequest;
import com.greensteel.report.dto.response.ReportResponse;
import com.greensteel.report.entity.Report;
import com.greensteel.report.mapper.ReportMapper;
import com.greensteel.report.repository.ReportRepository;
import com.greensteel.report.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;
    private final ReportMapper reportMapper;

    @Override
    public ReportResponse createReport(CreateReportRequest request) {

        Report report = Report.builder()
                .reportName(request.getReportName())
                .reportType(request.getReportType())
                .format(request.getFormat())
                .status(request.getStatus())
                .generatedDate(LocalDate.now())
                .build();

        return reportMapper.toResponse(reportRepository.save(report));
    }

    @Override
    public List<ReportResponse> getAllReports() {

        return reportRepository.findAll()
                .stream()
                .map(reportMapper::toResponse)
                .toList();
    }

    @Override
    public ReportResponse getReportById(Long id) {

        Report report = reportRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Report not found"));

        return reportMapper.toResponse(report);
    }

    @Override
    public ReportResponse updateReport(Long id,
                                       UpdateReportRequest request) {

        Report report = reportRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Report not found"));

        report.setReportName(request.getReportName());
        report.setReportType(request.getReportType());
        report.setFormat(request.getFormat());
        report.setStatus(request.getStatus());

        return reportMapper.toResponse(
                reportRepository.save(report));
    }

    @Override
    public void deleteReport(Long id) {

        Report report = reportRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Report not found"));

        reportRepository.delete(report);
    }
}