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
public class EvidenceDto {

    private String id;

    @NotBlank(message = "Case ID is required")
    private String caseId;

    private String caseNumber;
    private String evidenceCode;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Type is required")
    private String type;

    private String fileSize;
    private String fileFormat;
    private String sha256Hash;
    private String collectedBy;
    private String collectionDate;
    private String storageLocation;
    private Boolean isVerifiedIntegrity;
    private List<ChainOfCustodyDto> custodyChain;
}
