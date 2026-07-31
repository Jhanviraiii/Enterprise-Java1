package com.scap.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "evidence_hashes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvidenceHash {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evidence_id", nullable = false)
    private Evidence evidence;

    @Column(name = "computed_hash", nullable = false, length = 64)
    private String computedHash;

    @Column(name = "expected_hash", nullable = false, length = 64)
    private String expectedHash;

    @Column(name = "verification_timestamp", nullable = false)
    private LocalDateTime verificationTimestamp;

    @Column(name = "verified_by", nullable = false, length = 150)
    private String verifiedBy;

    @Column(nullable = false, length = 20)
    private String status; // VALID, TAMPERED, UNVERIFIED

    @PrePersist
    public void ensureId() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
        if (this.verificationTimestamp == null) {
            this.verificationTimestamp = LocalDateTime.now();
        }
    }
}
