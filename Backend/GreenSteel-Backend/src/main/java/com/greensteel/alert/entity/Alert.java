package com.greensteel.alert.entity;

import com.greensteel.unit.entity.Unit;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unit_id")
    private Unit unit;

    @Column(nullable = false)
    private String pollutant;

    @Column(nullable = false)
    private Double value;

    @Column(nullable = false)
    private String severity;

    @Column(nullable = false)
    private LocalDateTime alertTime;

    @Column(nullable = false)
    private boolean resolved;
}