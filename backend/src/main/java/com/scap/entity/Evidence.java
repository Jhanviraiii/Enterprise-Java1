package com.scap.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "evidence")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Evidence {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id", nullable = false)
    private CrimeRecord crimeRecord;

    @Column(name = "case_number", nullable = false, length = 50)
    private String caseNumber;

    @Column(name = "evidence_code", nullable = false, unique = true, length = 50)
    private String evidenceCode;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, length = 50)
    private String type; // CCTV_VIDEO, FINGERPRINT, DIGITAL_FORENSIC, AUDIO_RECORDING, WEAPON_LOG, DOCUMENT

    @Column(name = "file_size", nullable = false, length = 50)
    private String fileSize;

    @Column(name = "file_format", nullable = false, length = 30)
    private String fileFormat;

    @Column(name = "sha256_hash", nullable = false, length = 64)
    private String sha256Hash;

    @Column(name = "collected_by", nullable = false, length = 150)
    private String collectedBy;

    @Column(name = "collection_date", nullable = false)
    private LocalDateTime collectionDate;

    @Column(name = "storage_location", nullable = false, length = 255)
    private String storageLocation;

    @Column(name = "is_verified_integrity", nullable = false)
    private Boolean isVerifiedIntegrity;

    @OneToMany(mappedBy = "evidence", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<ChainOfCustody> custodyChain = new ArrayList<>();

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
