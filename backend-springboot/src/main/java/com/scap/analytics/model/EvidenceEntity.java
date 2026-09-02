package com.scap.analytics.model;

import com.google.cloud.firestore.annotation.DocumentId;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "evidence_vault")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvidenceEntity {

    @Id
    @DocumentId
    @Column(name = "id", nullable = false)
    private String id;

    @Column(name = "evidence_number", nullable = false, unique = true)
    private String evidenceNumber;

    @Column(name = "fir_id")
    private String firId;

    @Column(name = "item_name", nullable = false)
    private String itemName;

    @Column(name = "category", nullable = false)
    private String category; // DIGITAL, BALLISTICS, NARCOTICS, FORENSICS, DOCUMENT

    @Column(name = "sha256_hash", nullable = false, length = 64)
    private String sha256Hash;

    @Column(name = "custody_status", nullable = false)
    private String custodyStatus; // VAULT_SECURE, FORENSIC_LAB, COURT_PRESENTED, ARCHIVED

    @Column(name = "storage_location")
    private String storageLocation;

    @Column(name = "collected_by")
    private String collectedBy;

    @Column(name = "collection_date")
    private String collectionDate;

    @Column(name = "is_tamper_evident")
    private Boolean isTamperEvident;

    @Column(name = "blockchain_block_index")
    private Long blockchainBlockIndex;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
