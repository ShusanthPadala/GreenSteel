package com.greensteel.esg.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnvironmentalAlertResponse {

    private String unitName;

    private String pollutant;

    private Double value;

    private String severity;

    private boolean resolved;

    private LocalDateTime alertTime;

}