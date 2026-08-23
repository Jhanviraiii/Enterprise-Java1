package com.smartcrime.portal.dto;

import jakarta.validation.constraints.NotBlank;

public class FirDto {

    private String id;
    private String firNumber;

    @NotBlank(message = "FIR title is required")
    private String title;

    @NotBlank(message = "Incident type is required")
    private String incidentType;

    private String complainantName;
    private String complainantContact;
    private String district;
    private String locationDetails;
    private String incidentDateTime;
    private String filedDateTime;
    private String priority;
    private String status;
    private String description;
    private String reportingOfficerId;
    private String reportingOfficerName;

    public FirDto() {
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
}
