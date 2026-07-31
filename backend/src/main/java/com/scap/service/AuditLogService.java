package com.scap.service;

import com.scap.dto.AuditLogDto;
import java.util.List;

public interface AuditLogService {
    List<AuditLogDto> getAllLogs();
    AuditLogDto createLog(AuditLogDto dto);
}
