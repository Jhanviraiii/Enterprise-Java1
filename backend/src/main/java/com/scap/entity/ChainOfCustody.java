package com.scap.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "chain_of_custody")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChainOfCustody {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evidence_id", nullable = false)
    private Evidence evidence;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "handled_by", nullable = false, length = 150)
    private String handledBy;

    @Column(name = "badge_number", nullable = false, length = 50)
    private String badgeNumber;

    @Column(nullable = false, length = 50)
    private String action; // UPLOADED, TRANSFER_TO_LAB, ANALYSIS_COMPLETE, PRESENTED_IN_COURT, ARCHIVED

    @Column(nullable = false, columnDefinition = "TEXT")
    private String notes;

    @PrePersist
    public void ensureId() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
        if (this.timestamp == null) {
            this.timestamp = LocalDateTime.now();
        }
    }
}
