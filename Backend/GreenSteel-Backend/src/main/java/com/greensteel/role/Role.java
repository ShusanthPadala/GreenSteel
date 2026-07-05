    package com.greensteel.role;

    import jakarta.persistence.*;
    import lombok.Data;

    @Entity
    @Table(name = "roles")
    @Data
    public class Role
    {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        @Column(nullable = false , unique = true)
        private String roleName;
        private String description;
    }


