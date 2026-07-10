package com.greensteel.esg.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecentActivityResponse {

    private String title;

    private String description;

    private LocalDateTime activityTime;

}