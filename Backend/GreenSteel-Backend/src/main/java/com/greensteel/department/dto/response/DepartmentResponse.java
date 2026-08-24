package com.greensteel.department.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentResponse {

    private Long id;

    private String departmentName;

    private String departmentCode;

    private String description;

    private Boolean active;

}