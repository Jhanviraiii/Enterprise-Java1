package com.smartcrime.portal.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.util.UUID;

@Entity
@Table(name = "witnesses")
public class Witness {

    @Id
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "id", length = 255)
    private String id;

    @Column(name = "case_id", length = 255)
    private String caseId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "contact_number", length = 100)
    private String contactNumber;

    @Column(name = "statement", columnDefinition = "TEXT")
    private String statement;

    @Column(name = "credibility_rating", length = 50)
    private String credibilityRating; // HIGH | MODERATE | LOW

    @Column(name = "is_protected")
    private boolean isProtected;

    @Column(name = "deposition_date")
    private String depositionDate;

    @PrePersist
    public void ensureId() {
        if (this.id == null || this.id.trim().isEmpty()) {
            this.id = UUID.randomUUID().toString();
        }
    }

    public Witness() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCaseId() {
        return caseId;
    }

    public void setCaseId(String caseId) {
        this.caseId = caseId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getStatement() {
        return statement;
    }

    public void setStatement(String statement) {
        this.statement = statement;
    }

    public String getCredibilityRating() {
        return credibilityRating;
    }

    public void setCredibilityRating(String credibilityRating) {
        this.credibilityRating = credibilityRating;
    }

    public boolean isProtected() {
        return isProtected;
    }

    public void setProtected(boolean protectedVal) {
        isProtected = protectedVal;
    }

    public String getDepositionDate() {
        return depositionDate;
    }

    public void setDepositionDate(String depositionDate) {
        this.depositionDate = depositionDate;
    }
}
