package com.smartcrime.portal.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "pattern_alerts")
public class PatternAlert {

    @Id
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "id", length = 255)
    private String id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "similarity_score")
    private double similarityScore;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "matched_factors", columnDefinition = "text[]")
    private List<String> matchedFactors = new ArrayList<>();

    @Column(name = "primary_case_id", length = 255)
    private String primaryCaseId;

    @Column(name = "primary_fir_number", length = 100)
    private String primaryFirNumber;

    @Column(name = "related_case_id", length = 255)
    private String relatedCaseId;

    @Column(name = "related_fir_number", length = 100)
    private String relatedFirNumber;

    @Column(name = "detection_date")
    private String detectionDate;

    @Column(name = "status", length = 50)
    private String status; // UNREVIEWED | CONFIRMED | DISMISSED

    @Column(name = "suspect_id", length = 255)
    private String suspectId;

    @Column(name = "suspect_alias")
    private String suspectAlias;

    @PrePersist
    public void ensureId() {
        if (this.id == null || this.id.trim().isEmpty()) {
            this.id = UUID.randomUUID().toString();
        }
    }

    public PatternAlert() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public double getSimilarityScore() {
        return similarityScore;
    }

    public void setSimilarityScore(double similarityScore) {
        this.similarityScore = similarityScore;
    }

    public List<String> getMatchedFactors() {
        return matchedFactors;
    }

    public void setMatchedFactors(List<String> matchedFactors) {
        this.matchedFactors = matchedFactors;
    }

    public String getPrimaryCaseId() {
        return primaryCaseId;
    }

    public void setPrimaryCaseId(String primaryCaseId) {
        this.primaryCaseId = primaryCaseId;
    }

    public String getPrimaryFirNumber() {
        return primaryFirNumber;
    }

    public void setPrimaryFirNumber(String primaryFirNumber) {
        this.primaryFirNumber = primaryFirNumber;
    }

    public String getRelatedCaseId() {
        return relatedCaseId;
    }

    public void setRelatedCaseId(String relatedCaseId) {
        this.relatedCaseId = relatedCaseId;
    }

    public String getRelatedFirNumber() {
        return relatedFirNumber;
    }

    public void setRelatedFirNumber(String relatedFirNumber) {
        this.relatedFirNumber = relatedFirNumber;
    }

    public String getDetectionDate() {
        return detectionDate;
    }

    public void setDetectionDate(String detectionDate) {
        this.detectionDate = detectionDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSuspectId() {
        return suspectId;
    }

    public void setSuspectId(String suspectId) {
        this.suspectId = suspectId;
    }

    public String getSuspectAlias() {
        return suspectAlias;
    }

    public void setSuspectAlias(String suspectAlias) {
        this.suspectAlias = suspectAlias;
    }
}
