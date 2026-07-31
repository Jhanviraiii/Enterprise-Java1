package com.scap.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "ip_addresses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IPAddress {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "ip_string", nullable = false, unique = true, length = 50)
    private String ipString;

    @Column(length = 150)
    private String isp;

    @Column(length = 150)
    private String organization;

    @Column(length = 100)
    private String country;

    @Column(length = 100)
    private String city;

    @Column(name = "risk_score")
    private Integer riskScore;

    @Column(name = "is_tor")
    private Boolean isTor;

    @Column(name = "is_vpn")
    private Boolean isVpn;

    @Column(name = "threat_level", length = 20)
    private String threatLevel; // LOW, MODERATE, HIGH, CRITICAL

    @Column(name = "last_activity")
    private LocalDateTime lastActivity;

    @PrePersist
    public void ensureId() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
    }
}
