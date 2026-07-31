package com.scap.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "crime_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CrimeRecord {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "case_number", nullable = false, unique = true, length = 50)
    private String caseNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fir_id", nullable = false)
    private FIR fir;

    @Column(name = "fir_number", nullable = false, length = 50)
    private String firNumber;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(name = "crime_type", nullable = false, length = 100)
    private String crimeType;

    @Column(nullable = false, length = 100)
    private String district;

    @Column(name = "location_address", nullable = false, columnDefinition = "TEXT")
    private String locationAddress;

    @Column(name = "map_coord_x")
    private Double mapCoordX;

    @Column(name = "map_coord_y")
    private Double mapCoordY;

    @Column(name = "date_time_occurred", nullable = false)
    private LocalDateTime dateTimeOccurred;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_investigator_id")
    private User assignedInvestigator;

    @Column(name = "assigned_investigator_name", length = 150)
    private String assignedInvestigatorName;

    @Column(nullable = false, length = 50)
    private String status; // OPEN, UNDER_INVESTIGATION, SOLVED, CLOSED

    @Column(nullable = false, length = 20)
    private String severity; // MINOR, MODERATE, SEVERE, CRITICAL

    @ElementCollection
    @CollectionTable(name = "crime_mo_items", joinColumns = @JoinColumn(name = "crime_record_id"))
    @Column(name = "mo_item")
    @Builder.Default
    private List<String> modusOperandi = new ArrayList<>();

    @Column(name = "vehicle_details")
    private String vehicleDetails;

    @ElementCollection
    @CollectionTable(name = "crime_suspect_phones", joinColumns = @JoinColumn(name = "crime_record_id"))
    @Column(name = "phone_number")
    @Builder.Default
    private List<String> suspectPhoneNumbers = new ArrayList<>();

    @Column(name = "ip_address")
    private String ipAddress;

    @ManyToMany
    @JoinTable(
            name = "crime_record_criminals",
            joinColumns = @JoinColumn(name = "crime_record_id"),
            inverseJoinColumns = @JoinColumn(name = "criminal_profile_id")
    )
    @Builder.Default
    private List<CriminalProfile> linkedCriminals = new ArrayList<>();

    @OneToMany(mappedBy = "crimeRecord", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Victim> victims = new ArrayList<>();

    @OneToMany(mappedBy = "crimeRecord", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Witness> witnesses = new ArrayList<>();

    @OneToMany(mappedBy = "crimeRecord", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Evidence> evidenceItems = new ArrayList<>();

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
