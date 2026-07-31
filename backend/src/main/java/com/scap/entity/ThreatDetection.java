package com.scap.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "threat_detections")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThreatDetection {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "server_log_id")
    private ServerLog serverLog;

    @Column(name = "source_ip", nullable = false, length = 50)
    private String sourceIp;

    @Column(name = "threat_type", nullable = false, length = 100)
    private String threatType;

    @Column(nullable = false, length = 20)
    private String severity; // LOW, MODERATE, HIGH, CRITICAL

    @Column(name = "payload_pattern", columnDefinition = "TEXT")
    private String payloadPattern;

    @Column(name = "detected_timestamp", nullable = false)
    private LocalDateTime detectedTimestamp;

    @Column(length = 30)
    private String status; // NEW, MITIGATED, INVESTIGATING, BLOCKED

    @PrePersist
    public void ensureId() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
        if (this.detectedTimestamp == null) {
            this.detectedTimestamp = LocalDateTime.now();
        }
    }
}
