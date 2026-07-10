package com.greensteel.report.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateReportRequest {

    @NotBlank
    private String reportName;

    @NotBlank
    private String reportType;

    @NotBlank
    private String format;

    @NotBlank
    private String status;

}