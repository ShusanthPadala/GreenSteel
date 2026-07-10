package com.greensteel.esg.dto.request;

import com.greensteel.esg.enums.MetricCategory;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateESGMetricRequest {

    private String metricName;

    private MetricCategory category;

    private Double metricValue;

    private String unit;

}