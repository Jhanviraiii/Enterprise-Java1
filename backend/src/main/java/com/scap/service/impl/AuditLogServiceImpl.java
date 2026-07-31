package com.scap.service.impl;

import com.scap.dto.AuditLogDto;
import com.scap.entity.AuditLog;
import com.scap.repository.AuditLogRepository;
import com.scap.service.AuditLogService;
import com.scap.util.DateUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Override
    public List<AuditLogDto> getAllLogs() {
        return auditLogRepository.findByOrderByCreatedAtDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public AuditLogDto createLog(AuditLogDto dto) {
        AuditLog log = AuditLog.builder()
                .timestamp(dto.getTimestamp() != null ? dto.getTimestamp() : DateUtils.nowString())
                .badgeNumber(dto.getBadgeNumber())
                .userName(dto.getUserName())
                .role(dto.getRole())
                .action(dto.getAction())
                .module(dto.getModule())
                .details(dto.getDetails())
                .ipAddress(dto.getIpAddress() != null ? dto.getIpAddress() : "10.14.0.12")
                .build();

        AuditLog saved = auditLogRepository.save(log);
        return mapToDto(saved);
    }

    private AuditLogDto mapToDto(AuditLog a) {
        return AuditLogDto.builder()
                .id(a.getId())
                .timestamp(a.getTimestamp())
                .badgeNumber(a.getBadgeNumber())
                .userName(a.getUserName())
                .role(a.getRole())
                .action(a.getAction())
                .module(a.getModule())
                .details(a.getDetails())
                .ipAddress(a.getIpAddress())
                .build();
    }
}
