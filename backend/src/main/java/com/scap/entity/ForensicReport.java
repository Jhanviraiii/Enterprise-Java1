package com.scap.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "forensic_reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ForensicReport {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evidence_id", nullable = false)
    private Evidence evidence;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id", nullable = false)
    private CrimeRecord crimeRecord;

    @Column(name = "report_number", nullable = false, unique = true, length = 50)
    private String reportNumber;

    @Column(name = "examiner_name", nullable = false, length = 150)
    private String examinerName;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String findings;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String methodology;

    @Column(nullable = false, length = 30)
    private String status; // PENDING, IN_PROGRESS, COMPLETED, ARCHIVED

    @Column(name = "report_date", nullable = false)
    private LocalDateTime reportDate;

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
