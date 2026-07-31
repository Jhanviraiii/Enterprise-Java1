package com.scap.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "victims")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Victim {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id", nullable = false)
    private CrimeRecord crimeRecord;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false)
    private Integer age;

    @Column(name = "contact_number", nullable = false, length = 50)
    private String contactNumber;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String address;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String statement;

    @Column(name = "protection_status", nullable = false, length = 30)
    private String protectionStatus; // NONE, REQUESTED, ACTIVE_PROTECTION

    @Column(name = "is_confidential", nullable = false)
    private Boolean isConfidential;

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
