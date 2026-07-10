package com.greensteel.esg.dto.response;

import com.greensteel.esg.enums.MetricCategory;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ESGMetricResponse {

    private String metricName;

    private MetricCategory category;

    private Double metricValue;

    private String unit;

}