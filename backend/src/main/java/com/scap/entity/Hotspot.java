package com.scap.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "hotspots")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hotspot {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "sector_name", nullable = false, length = 150)
    private String sectorName;

    @Column(name = "sector_code", nullable = false, unique = true, length = 50)
    private String sectorCode;

    @Column(name = "risk_level", nullable = false, length = 20)
    private String riskLevel; // LOW, MODERATE, HIGH, CRITICAL

    @Column(name = "total_incidents", nullable = false)
    private Integer totalIncidents;

    @Column(name = "primary_crime_type", nullable = false, length = 100)
    private String primaryCrimeType;

    @Column(name = "map_coord_x", nullable = false)
    private Double mapCoordX;

    @Column(name = "map_coord_y", nullable = false)
    private Double mapCoordY;

    @Column(name = "active_patrol_units", nullable = false)
    private Integer activePatrolUnits;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "district_id")
    private District district;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void ensureIdAndTimestamp() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
