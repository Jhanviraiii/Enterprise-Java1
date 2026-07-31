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
public class CriminalProfileDto {

    private String id;

    @NotBlank(message = "Code name is required")
    private String codeName;

    @NotBlank(message = "Legal name is required")
    private String legalName;

    private List<String> aliases;
    private String photoUrl;
    private String dateOfBirth;
    private String gender;
    private String height;
    private String build;
    private List<String> scarsOrTattoos;
    private String threatLevel;
    private List<String> modusOperandi;
    private List<String> pastConvictions;
    private List<String> knownAssociates;
    private String status;
    private List<String> linkedCaseIds;
}
