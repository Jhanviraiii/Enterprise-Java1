package com.scap.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "investigations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Investigation {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "case_number", nullable = false, unique = true, length = 50)
    private String caseNumber;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id", nullable = false, unique = true)
    private CrimeRecord crimeRecord;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_investigator_id", nullable = false)
    private User leadInvestigator;

    @Column(nullable = false, length = 50)
    private String status; // UNDER_INVESTIGATION, EVIDENCE_COLLECTION, FORENSIC_ANALYSIS, CHARGE_SHEET_FILED, SOLVED, CLOSED

    @Column(nullable = false, columnDefinition = "TEXT")
    private String summary;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "target_completion_date")
    private LocalDateTime targetCompletionDate;

    @OneToMany(mappedBy = "investigation", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<InvestigationTimeline> timeline = new ArrayList<>();

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
