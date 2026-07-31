package com.scap.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "report_number", nullable = false, unique = true, length = 50)
    private String reportNumber;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(name = "report_type", nullable = false, length = 50)
    private String reportType; // EXECUTIVE_SUMMARY, FIR_ANALYSIS, CRIME_ANALYTICS, EVIDENCE_LOG, OFFICER_ACTIVITY

    @Column(name = "generated_by", nullable = false, length = 150)
    private String generatedBy;

    @Column(name = "generated_date", nullable = false)
    private LocalDateTime generatedDate;

    @Column(name = "date_range_start")
    private LocalDateTime dateRangeStart;

    @Column(name = "date_range_end")
    private LocalDateTime dateRangeEnd;

    @Column(name = "file_format", nullable = false, length = 20)
    private String fileFormat; // PDF, CSV, JSON

    @Column(name = "file_url", length = 500)
    private String fileUrl;

    @Column(name = "summary_data", columnDefinition = "TEXT")
    private String summaryData;

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
