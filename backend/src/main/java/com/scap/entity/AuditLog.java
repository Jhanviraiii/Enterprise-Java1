package com.scap.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, length = 30)
    private String timestamp;

    @Column(name = "badge_number", nullable = false, length = 50)
    private String badgeNumber;

    @Column(name = "user_name", nullable = false, length = 150)
    private String userName;

    @Column(nullable = false, length = 50)
    private String role; // ADMIN, POLICE_OFFICER, INVESTIGATOR, FORENSIC_OFFICER

    @Column(nullable = false, length = 100)
    private String action;

    @Column(nullable = false, length = 50)
    private String module; // AUTH, USER, FIR, CRIME, CRIMINAL, EVIDENCE, INVESTIGATION, REPORT

    @Column(nullable = false, columnDefinition = "TEXT")
    private String details;

    @Column(name = "ip_address", nullable = false, length = 50)
    private String ipAddress;

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
