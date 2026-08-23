package com.smartcrime.portal.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "firs")
public class FIR {

    @Id
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "id", length = 255)
    private String id;

    @Column(name = "fir_number", unique = true, nullable = false, length = 100)
    private String firNumber; // e.g. FIR-2026-08942

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "incident_type", length = 100)
    private String incidentType;

    @Column(name = "complainant_name")
    private String complainantName;

    @Column(name = "complainant_contact", length = 100)
    private String complainantContact;

    @Column(name = "district", length = 100)
    private String district;

    @Column(name = "location_details", columnDefinition = "TEXT")
    private String locationDetails;

    @Column(name = "incident_date_time")
    private String incidentDateTime;

    @Column(name = "filed_date_time")
    private String filedDateTime;

    @Column(name = "priority", length = 50)
    private String priority; // LOW | MEDIUM | HIGH | CRITICAL

    @Column(name = "status", length = 50)
    private String status; // DRAFT | FILED | UNDER_REVIEW | TRANSFERRED_TO_INVESTIGATION | CLOSED

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "reporting_officer_id", length = 255)
    private String reportingOfficerId;

    @Column(name = "reporting_officer_name")
    private String reportingOfficerName;

    @Column(name = "assigned_investigator_id", length = 255)
    private String assignedInvestigatorId;

    @Column(name = "assigned_investigator_name")
    private String assignedInvestigatorName;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "history", columnDefinition = "jsonb")
    private List<FirVersion> history = new ArrayList<>();

    @PrePersist
    public void ensureId() {
        if (this.id == null || this.id.trim().isEmpty()) {
            this.id = UUID.randomUUID().toString();
        }
    }

    public FIR() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFirNumber() {
        return firNumber;
    }

    public void setFirNumber(String firNumber) {
        this.firNumber = firNumber;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getIncidentType() {
        return incidentType;
    }

    public void setIncidentType(String incidentType) {
        this.incidentType = incidentType;
    }

    public String getComplainantName() {
        return complainantName;
    }

    public void setComplainantName(String complainantName) {
        this.complainantName = complainantName;
    }

    public String getComplainantContact() {
        return complainantContact;
    }

    public void setComplainantContact(String complainantContact) {
        this.complainantContact = complainantContact;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getLocationDetails() {
        return locationDetails;
    }

    public void setLocationDetails(String locationDetails) {
        this.locationDetails = locationDetails;
    }

    public String getIncidentDateTime() {
        return incidentDateTime;
    }

    public void setIncidentDateTime(String incidentDateTime) {
        this.incidentDateTime = incidentDateTime;
    }

    public String getFiledDateTime() {
        return filedDateTime;
    }

    public void setFiledDateTime(String filedDateTime) {
        this.filedDateTime = filedDateTime;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getReportingOfficerId() {
        return reportingOfficerId;
    }

    public void setReportingOfficerId(String reportingOfficerId) {
        this.reportingOfficerId = reportingOfficerId;
    }

    public String getReportingOfficerName() {
        return reportingOfficerName;
    }

    public void setReportingOfficerName(String reportingOfficerName) {
        this.reportingOfficerName = reportingOfficerName;
    }

    public String getAssignedInvestigatorId() {
        return assignedInvestigatorId;
    }

    public void setAssignedInvestigatorId(String assignedInvestigatorId) {
        this.assignedInvestigatorId = assignedInvestigatorId;
    }

    public String getAssignedInvestigatorName() {
        return assignedInvestigatorName;
    }

    public void setAssignedInvestigatorName(String assignedInvestigatorName) {
        this.assignedInvestigatorName = assignedInvestigatorName;
    }

    public List<FirVersion> getHistory() {
        return history;
    }

    public void setHistory(List<FirVersion> history) {
        this.history = history;
    }
}
