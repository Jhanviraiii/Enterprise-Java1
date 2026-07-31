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
public class CrimeRecordDto {

    private String id;
    private String caseNumber;
    private String firId;
    private String firNumber;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Crime type is required")
    private String crimeType;

    @NotBlank(message = "District is required")
    private String district;

    @NotBlank(message = "Location address is required")
    private String locationAddress;

    private MapCoordinates coordinates;
    private String dateTimeOccurred;

    @NotBlank(message = "Description is required")
    private String description;

    private String assignedInvestigatorId;
    private String assignedInvestigatorName;
    private String status;
    private String severity;

    private List<String> modusOperandi;
    private String vehicleDetails;
    private List<String> suspectPhoneNumbers;
    private String ipAddress;

    private List<String> linkedCriminalIds;
    private List<String> evidenceIds;
    private List<String> victimIds;
    private List<String> witnessIds;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MapCoordinates {
        private Double x;
        private Double y;
    }
}
