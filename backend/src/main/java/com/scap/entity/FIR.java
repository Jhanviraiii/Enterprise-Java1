package com.scap.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "firs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FIR {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "fir_number", nullable = false, unique = true, length = 50)
    private String firNumber;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(name = "incident_type", nullable = false, length = 100)
    private String incidentType;

    @Column(name = "complainant_name", nullable = false, length = 150)
    private String complainantName;

    @Column(name = "complainant_contact", nullable = false, length = 50)
    private String complainantContact;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "district_id", nullable = false)
    private District district;

    @Column(name = "district_name", nullable = false, length = 100)
    private String districtName;

    @Column(name = "location_details", nullable = false, columnDefinition = "TEXT")
    private String locationDetails;

    @Column(name = "incident_date_time", nullable = false)
    private LocalDateTime incidentDateTime;

    @Column(name = "filed_date_time", nullable = false)
    private LocalDateTime filedDateTime;

    @Column(nullable = false, length = 20)
    private String priority; // LOW, MEDIUM, HIGH, CRITICAL

    @Column(nullable = false, length = 50)
    private String status; // DRAFT, FILED, UNDER_REVIEW, TRANSFERRED_TO_INVESTIGATION, CLOSED

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporting_officer_id", nullable = false)
    private User reportingOfficer;

    @Column(name = "reporting_officer_name", nullable = false, length = 150)
    private String reportingOfficerName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_investigator_id")
    private User assignedInvestigator;

    @Column(name = "assigned_investigator_name", length = 150)
    private String assignedInvestigatorName;

    @OneToMany(mappedBy = "fir", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<FIRHistory> history = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void ensureIdAndTimestamps() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void updateTimestamp() {
        this.updatedAt = LocalDateTime.now();
    }
}
