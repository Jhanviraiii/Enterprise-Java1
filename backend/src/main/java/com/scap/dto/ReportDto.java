package com.scap.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReportDto {

    private String id;
    private String reportNumber;
    private String title;
    private String reportType;
    private String generatedBy;
    private String generatedDate;
    private String dateRangeStart;
    private String dateRangeEnd;
    private String fileFormat;
    private String fileUrl;
    private String summaryData;
}
