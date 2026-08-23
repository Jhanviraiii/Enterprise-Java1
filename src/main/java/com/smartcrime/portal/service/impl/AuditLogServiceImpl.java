package com.smartcrime.portal.service.impl;

import com.smartcrime.portal.model.AuditLog;
import com.smartcrime.portal.repository.AuditLogRepository;
import com.smartcrime.portal.service.AuditLogService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@Transactional
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogServiceImpl(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLog> getLogsByBadgeNumber(String badgeNumber) {
        return auditLogRepository.findByBadgeNumber(badgeNumber);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLog> getLogsByModule(String module) {
        return auditLogRepository.findByModule(module);
    }

    @Override
    public AuditLog logAction(AuditLog log) {
        if (log.getTimestamp() == null || log.getTimestamp().trim().isEmpty()) {
            log.setTimestamp(Instant.now().toString());
        }
        return auditLogRepository.save(log);
    }
}
