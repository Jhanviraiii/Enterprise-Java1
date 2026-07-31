package com.scap.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "pattern_matches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatternMatch {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pattern_alert_id", nullable = false)
    private PatternAlert patternAlert;

    @Column(name = "factor_type", nullable = false, length = 50)
    private String factorType; // MODUS_OPERANDI, VEHICLE, PHONE, IP, DNA, FINGERPRINT

    @Column(name = "factor_value", nullable = false, columnDefinition = "TEXT")
    private String factorValue;

    @Column(name = "match_score", nullable = false)
    private Integer matchScore;

    @PrePersist
    public void ensureId() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
    }
}
