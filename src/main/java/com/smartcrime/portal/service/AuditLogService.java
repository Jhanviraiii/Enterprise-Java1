package com.smartcrime.portal.service;

import com.smartcrime.portal.model.AuditLog;

import java.util.List;

public interface AuditLogService {
    List<AuditLog> getAllLogs();
    List<AuditLog> getLogsByBadgeNumber(String badgeNumber);
    List<AuditLog> getLogsByModule(String module);
    AuditLog logAction(AuditLog log);
}
