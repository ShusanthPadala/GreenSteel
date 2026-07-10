package com.greensteel.alert.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlertResponse {

    private Long id;

    private Long unitId;
    private String unitName;

    private String pollutant;

    private Double value;

    private String severity;

    private LocalDateTime alertTime;

    private boolean resolved;
}