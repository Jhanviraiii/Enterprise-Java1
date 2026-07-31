package com.scap.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "server_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServerLog {

    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "source_ip", nullable = false, length = 50)
    private String sourceIp;

    @Column(name = "request_method", nullable = false, length = 10)
    private String requestMethod;

    @Column(name = "request_url", nullable = false, columnDefinition = "TEXT")
    private String requestUrl;

    @Column(name = "http_status", nullable = false)
    private Integer httpStatus;

    @Column(name = "user_agent", columnDefinition = "TEXT")
    private String userAgent;

    @Column(name = "payload_data", columnDefinition = "TEXT")
    private String payloadData;

    @Column(name = "threat_flag", length = 50)
    private String threatFlag; // NORMAL, SQL_INJECTION, BRUTE_FORCE, XSS, MALICIOUS_PAYLOAD

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
