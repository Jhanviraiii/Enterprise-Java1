package com.scap.controller;

import com.scap.dto.AuditLogDto;
import com.scap.service.AuditLogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<List<AuditLogDto>> getAllLogs() {
        return ResponseEntity.ok(auditLogService.getAllLogs());
    }

    @PostMapping
    public ResponseEntity<AuditLogDto> createLog(@Valid @RequestBody AuditLogDto dto) {
        return new ResponseEntity<>(auditLogService.createLog(dto), HttpStatus.CREATED);
    }
}
