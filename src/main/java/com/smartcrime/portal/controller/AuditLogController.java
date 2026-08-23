package com.smartcrime.portal.controller;

import com.smartcrime.portal.dto.ApiResponse;
import com.smartcrime.portal.model.AuditLog;
import com.smartcrime.portal.service.AuditLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/audit")
public class AuditLogController {

    private final AuditLogService auditLogService;

    public AuditLogController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AuditLog>>> getAllLogs(
            @RequestParam(required = false) String badgeNumber,
            @RequestParam(required = false) String module) {
        List<AuditLog> logs;
        if (badgeNumber != null && !badgeNumber.trim().isEmpty()) {
            logs = auditLogService.getLogsByBadgeNumber(badgeNumber);
        } else if (module != null && !module.trim().isEmpty()) {
            logs = auditLogService.getLogsByModule(module);
        } else {
            logs = auditLogService.getAllLogs();
        }
        return ResponseEntity.ok(ApiResponse.success("Audit logs retrieved", logs));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AuditLog>> logAction(@RequestBody AuditLog log) {
        AuditLog created = auditLogService.logAction(log);
        return ResponseEntity.status(201).body(ApiResponse.success("Audit log recorded", created));
    }
}
