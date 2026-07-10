package com.greensteel.emissionrecord.entity;

import com.greensteel.unit.entity.Unit;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "emission_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmissionRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="unit_id",nullable=false)
    private Unit unit;

    @Column(nullable=false)
    private Double cox;

    @Column(nullable=false)
    private Double nox;

    @Column(nullable=false)
    private Double sox;

    @Column(nullable=false)
    private Double pm;

    @Column(nullable=false)
    private Double flyAsh;

    @Column(nullable=false)
    private Double temperature;

    @Column(nullable=false)
    private Double efficiency;

    @Column(nullable=false)
    private Double healthScore;

    @Column(nullable=false)
    private String status;

    @Column(nullable=false)
    private LocalDateTime recordedAt;

}