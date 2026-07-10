package com.greensteel.report.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String reportName;

    @Column(nullable = false)
    private String reportType;

    @Column(nullable = false)
    private String format;

    @Column(nullable = false)
    private LocalDate generatedDate;

    @Column(nullable = false)
    private String status;

}