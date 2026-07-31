package com.scap.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChainOfCustodyDto {
    private String id;
    private String timestamp;
    private String handledBy;
    private String badgeNumber;
    private String action;
    private String notes;
}
