package com.scap.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "criminal_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CriminalProfile {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "code_name", nullable = false, length = 100)
    private String codeName;

    @Column(name = "legal_name", nullable = false, length = 150)
    private String legalName;

    @ElementCollection
    @CollectionTable(name = "criminal_aliases", joinColumns = @JoinColumn(name = "criminal_id"))
    @Column(name = "alias_name")
    @Builder.Default
    private List<String> aliases = new ArrayList<>();

    @Column(name = "photo_url", length = 500)
    private String photoUrl;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(length = 20)
    private String gender;

    @Column(length = 20)
    private String height;

    @Column(length = 50)
    private String build;

    @ElementCollection
    @CollectionTable(name = "criminal_scars_tattoos", joinColumns = @JoinColumn(name = "criminal_id"))
    @Column(name = "scar_or_tattoo")
    @Builder.Default
    private List<String> scarsOrTattoos = new ArrayList<>();

    @Column(name = "threat_level", nullable = false, length = 20)
    private String threatLevel; // LOW, MEDIUM, HIGH, EXTREME

    @ElementCollection
    @CollectionTable(name = "criminal_mo", joinColumns = @JoinColumn(name = "criminal_id"))
    @Column(name = "mo_item")
    @Builder.Default
    private List<String> modusOperandi = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "criminal_convictions", joinColumns = @JoinColumn(name = "criminal_id"))
    @Column(name = "conviction")
    @Builder.Default
    private List<String> pastConvictions = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "criminal_associates", joinColumns = @JoinColumn(name = "criminal_id"))
    @Column(name = "associate_name")
    @Builder.Default
    private List<String> knownAssociates = new ArrayList<>();

    @Column(nullable = false, length = 30)
    private String status; // WANTED, IN_CUSTODY, UNDER_SURVEILLANCE, CLEARED

    @ManyToMany(mappedBy = "linkedCriminals")
    @Builder.Default
    private List<CrimeRecord> linkedCrimes = new ArrayList<>();

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
