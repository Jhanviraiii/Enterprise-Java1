package com.scap.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FirVersionDto {
    private String id;
    private String timestamp;
    private String updatedBy;
    private String changesSummary;
    private String status;
}
