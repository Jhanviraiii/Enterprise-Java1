package com.scap.service;

import com.scap.dto.PatternAlertDto;
import com.scap.dto.PatternMatchStatsDto;
import java.util.List;

public interface PatternDetectionService {
    List<PatternAlertDto> getAllPatternAlerts();
    PatternAlertDto getAlertById(String id);
    PatternAlertDto confirmAlert(String alertId);
    PatternAlertDto dismissAlert(String alertId);
    PatternAlertDto runPatternScan();
    PatternMatchStatsDto getPatternMatchStats();
}

