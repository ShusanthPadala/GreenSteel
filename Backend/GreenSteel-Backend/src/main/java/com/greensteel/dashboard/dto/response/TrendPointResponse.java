package com.greensteel.dashboard.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrendPointResponse {

    private String month;

    private Integer year;

    private Double cox;

    private Double nox;

    private Double sox;

    private Double pm;

}