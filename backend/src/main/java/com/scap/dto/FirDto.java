package com.scap.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FirDto {

    private String id;
    private String firNumber;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Incident type is required")
    private String incidentType;

    @NotBlank(message = "Complainant name is required")
    private String complainantName;

    @NotBlank(message = "Complainant contact is required")
    private String complainantContact;

    @NotBlank(message = "District is required")
    private String district;

    @NotBlank(message = "Location details required")
    private String locationDetails;

    private String incidentDateTime;
    private String filedDateTime;
    private String priority;
    private String status;

    @NotBlank(message = "Description is required")
    private String description;

    private String reportingOfficerId;
    private String reportingOfficerName;
    private String assignedInvestigatorId;
    private String assignedInvestigatorName;

    private List<FirVersionDto> history;
}
