package com.scap.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PatternAlertDto {

    private String id;
    private String title;
    private Integer similarityScore;
    private List<String> matchedFactors;
    private String primaryCaseId;
    private String primaryFirNumber;
    private String relatedCaseId;
    private String relatedFirNumber;
    private String detectionDate;
    private String status;
    private String suspectId;
    private String suspectAlias;
}
