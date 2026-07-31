package com.scap.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "witnesses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Witness {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id", nullable = false)
    private CrimeRecord crimeRecord;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "contact_number", nullable = false, length = 50)
    private String contactNumber;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String statement;

    @Column(name = "credibility_rating", nullable = false, length = 20)
    private String credibilityRating; // HIGH, MODERATE, LOW

    @Column(name = "is_protected", nullable = false)
    private Boolean isProtected;

    @Column(name = "deposition_date")
    private LocalDateTime depositionDate;

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
