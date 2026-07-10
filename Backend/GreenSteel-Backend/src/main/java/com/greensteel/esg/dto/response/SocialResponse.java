package com.greensteel.esg.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SocialResponse {

    private Double socialScore;

    private Double employeeSafety;

    private Double trainingHours;

}