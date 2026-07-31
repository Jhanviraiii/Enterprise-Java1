package com.scap.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WitnessDto {

    private String id;

    @NotBlank(message = "Case ID is required")
    private String caseId;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Contact number is required")
    private String contactNumber;

    @NotBlank(message = "Statement is required")
    private String statement;

    private String credibilityRating;
    private Boolean isProtected;
    private String depositionDate;
}
