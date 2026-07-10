package com.greensteel.dashboard.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrendPointResponse {

    private String month;

    private Double cox;
    private Double nox;
    private Double sox;
    private Double pm;
}