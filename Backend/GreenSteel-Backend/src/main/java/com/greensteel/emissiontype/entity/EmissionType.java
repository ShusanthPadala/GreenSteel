package com.greensteel.emissiontype.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "emission_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmissionType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String emissionType;

    @Column(nullable = false)
    private String unit;

    private String description;

    /** Maximum allowed reading for this pollutant (e.g. 50 mg/Nm3 for PM). Null = use plant default. */
    private Double limitValue;

    @Builder.Default
    private Boolean active = true;
}