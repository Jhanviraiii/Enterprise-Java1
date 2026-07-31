package com.scap.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "pattern_alerts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatternAlert {

    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(name = "similarity_score", nullable = false)
    private Integer similarityScore;

    @ElementCollection
    @CollectionTable(name = "pattern_matched_factors", joinColumns = @JoinColumn(name = "pattern_alert_id"))
    @Column(name = "factor")
    @Builder.Default
    private List<String> matchedFactors = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "primary_case_id", nullable = false)
    private CrimeRecord primaryCase;

    @Column(name = "primary_fir_number", nullable = false, length = 50)
    private String primaryFirNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "related_case_id", nullable = false)
    private CrimeRecord relatedCase;

    @Column(name = "related_fir_number", nullable = false, length = 50)
    private String relatedFirNumber;

    @Column(name = "detection_date", nullable = false)
    private LocalDateTime detectionDate;

    @Column(nullable = false, length = 30)
    private String status; // UNREVIEWED, CONFIRMED, DISMISSED

    @Column(name = "suspect_id", length = 36)
    private String suspectId;

    @Column(name = "suspect_alias", length = 100)
    private String suspectAlias;

    @OneToMany(mappedBy = "patternAlert", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<PatternMatch> patternMatches = new ArrayList<>();

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
