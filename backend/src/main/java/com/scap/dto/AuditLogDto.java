package com.scap.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuditLogDto {

    private String id;
    private String timestamp;
    private String badgeNumber;
    private String userName;
    private String role;
    private String action;
    private String module;
    private String details;
    private String ipAddress;
}
