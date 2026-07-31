package com.scap.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "activity_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityHistory {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "entity_type", nullable = false, length = 50)
    private String entityType; // FIR, CRIME_RECORD, EVIDENCE, INVESTIGATION

    @Column(name = "entity_id", nullable = false, length = 36)
    private String entityId;

    @Column(name = "action_type", nullable = false, length = 50)
    private String actionType; // CREATED, UPDATED, STATUS_CHANGED, DELETED

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "performed_by", nullable = false, length = 150)
    private String performedBy;

    @Column(columnDefinition = "TEXT")
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
