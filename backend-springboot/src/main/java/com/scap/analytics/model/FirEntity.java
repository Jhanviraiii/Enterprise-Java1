package com.scap.analytics.model;

import com.google.cloud.firestore.annotation.DocumentId;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "first_information_reports")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FirEntity {

    @Id
    @DocumentId
    @Column(name = "id", nullable = false, unique = true)
    private String id;

    @Column(name = "fir_number", nullable = false, unique = true)
    private String firNumber;

    @Column(name = "crime_type", nullable = false)
    private String crimeType;

    @Column(name = "section_of_law")
    private String sectionOfLaw;

    @Column(name = "complainant_name", nullable = false)
    private String complainantName;

    @Column(name = "suspect_name")
    private String suspectName;

    @Column(name = "status", nullable = false)
    private String status; // REGISTERED, INVESTIGATION, CHARGESHEET, CLOSED

    @Column(name = "priority", nullable = false)
    private String priority; // CRITICAL, HIGH, MEDIUM, LOW

    @Column(name = "incident_date")
    private String incidentDate;

    @Column(name = "filing_date")
    private String filingDate;

    @Column(name = "location_details", columnDefinition = "TEXT")
    private String locationDetails;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "investigating_officer")
    private String investigatingOfficer;

    @Column(name = "police_station")
    private String policeStation;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "ai_threat_score")
    private Integer aiThreatScore;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
