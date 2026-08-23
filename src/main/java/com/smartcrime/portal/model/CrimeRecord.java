package com.smartcrime.portal.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "crime_records")
public class CrimeRecord {

    @Id
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "id", length = 255)
    private String id;

    @Column(name = "case_number", unique = true, nullable = false, length = 100)
    private String caseNumber; // e.g. CR-2026-4410

    @Column(name = "fir_id", length = 255)
    private String firId;

    @Column(name = "fir_number", length = 100)
    private String firNumber;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "crime_type", length = 100)
    private String crimeType;

    @Column(name = "district", length = 100)
    private String district;

    @Column(name = "location_address", columnDefinition = "TEXT")
    private String locationAddress;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "coordinates", columnDefinition = "jsonb")
    private Coordinates coordinates;

    @Column(name = "date_time_occurred")
    private String dateTimeOccurred;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "assigned_investigator_id", length = 255)
    private String assignedInvestigatorId;

    @Column(name = "assigned_investigator_name")
    private String assignedInvestigatorName;

    @Column(name = "status", length = 50)
    private String status; // OPEN | UNDER_INVESTIGATION | SOLVED | CLOSED

    @Column(name = "severity", length = 50)
    private String severity; // MINOR | MODERATE | SEVERE | CRITICAL

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "modus_operandi", columnDefinition = "text[]")
    private List<String> modusOperandi = new ArrayList<>();

    @Column(name = "vehicle_details", columnDefinition = "TEXT")
    private String vehicleDetails;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "suspect_phone_numbers", columnDefinition = "text[]")
    private List<String> suspectPhoneNumbers = new ArrayList<>();

    @Column(name = "ip_address", length = 100)
    private String ipAddress;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "linked_criminal_ids", columnDefinition = "text[]")
    private List<String> linkedCriminalIds = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "evidence_ids", columnDefinition = "text[]")
    private List<String> evidenceIds = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "victim_ids", columnDefinition = "text[]")
    private List<String> victimIds = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "witness_ids", columnDefinition = "text[]")
    private List<String> witnessIds = new ArrayList<>();

    @PrePersist
    public void ensureId() {
        if (this.id == null || this.id.trim().isEmpty()) {
            this.id = UUID.randomUUID().toString();
        }
    }

    public CrimeRecord() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCaseNumber() {
        return caseNumber;
    }

    public void setCaseNumber(String caseNumber) {
        this.caseNumber = caseNumber;
    }

    public String getFirId() {
        return firId;
    }

    public void setFirId(String firId) {
        this.firId = firId;
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

    public String getCrimeType() {
        return crimeType;
    }

    public void setCrimeType(String crimeType) {
        this.crimeType = crimeType;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getLocationAddress() {
        return locationAddress;
    }

    public void setLocationAddress(String locationAddress) {
        this.locationAddress = locationAddress;
    }

    public Coordinates getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(Coordinates coordinates) {
        this.coordinates = coordinates;
    }

    public String getDateTimeOccurred() {
        return dateTimeOccurred;
    }

    public void setDateTimeOccurred(String dateTimeOccurred) {
        this.dateTimeOccurred = dateTimeOccurred;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public List<String> getModusOperandi() {
        return modusOperandi;
    }

    public void setModusOperandi(List<String> modusOperandi) {
        this.modusOperandi = modusOperandi;
    }

    public String getVehicleDetails() {
        return vehicleDetails;
    }

    public void setVehicleDetails(String vehicleDetails) {
        this.vehicleDetails = vehicleDetails;
    }

    public List<String> getSuspectPhoneNumbers() {
        return suspectPhoneNumbers;
    }

    public void setSuspectPhoneNumbers(List<String> suspectPhoneNumbers) {
        this.suspectPhoneNumbers = suspectPhoneNumbers;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public List<String> getLinkedCriminalIds() {
        return linkedCriminalIds;
    }

    public void setLinkedCriminalIds(List<String> linkedCriminalIds) {
        this.linkedCriminalIds = linkedCriminalIds;
    }

    public List<String> getEvidenceIds() {
        return evidenceIds;
    }

    public void setEvidenceIds(List<String> evidenceIds) {
        this.evidenceIds = evidenceIds;
    }

    public List<String> getVictimIds() {
        return victimIds;
    }

    public void setVictimIds(List<String> victimIds) {
        this.victimIds = victimIds;
    }

    public List<String> getWitnessIds() {
        return witnessIds;
    }

    public void setWitnessIds(List<String> witnessIds) {
        this.witnessIds = witnessIds;
    }
}
