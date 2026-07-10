package com.greensteel.unit.entity;

import com.greensteel.common.enums.UnitStatus;
import com.greensteel.department.entity.Department;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "units")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Unit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String unitName;

    @Column(nullable = false, unique = true)
    private String unitCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Enumerated(EnumType.STRING)
    private UnitStatus status;

    private Boolean active;
}