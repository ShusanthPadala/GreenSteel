package com.greensteel.report.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateReportRequest {

        @NotBlank
        private String reportName;

        @NotBlank
        private String reportType;

        @NotBlank
        private String format;

        @NotBlank
        private String status;

}