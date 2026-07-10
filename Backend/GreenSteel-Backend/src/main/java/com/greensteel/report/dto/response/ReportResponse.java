package com.greensteel.report.dto.response;

import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportResponse {

    private Long id;

    private String reportName;

    private String reportType;

    private String format;

    private LocalDate generatedDate;

    private String status;

}