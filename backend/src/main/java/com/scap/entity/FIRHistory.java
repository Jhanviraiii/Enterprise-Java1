package com.scap.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "fir_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FIRHistory {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fir_id", nullable = false)
    private FIR fir;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "updated_by", nullable = false, length = 150)
    private String updatedBy;

    @Column(name = "changes_summary", nullable = false, columnDefinition = "TEXT")
    private String changesSummary;

    @Column(nullable = false, length = 50)
    private String status;

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
