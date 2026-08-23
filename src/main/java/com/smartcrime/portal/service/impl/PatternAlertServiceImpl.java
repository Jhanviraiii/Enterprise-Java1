package com.smartcrime.portal.service.impl;

import com.smartcrime.portal.exception.ResourceNotFoundException;
import com.smartcrime.portal.model.PatternAlert;
import com.smartcrime.portal.repository.PatternAlertRepository;
import com.smartcrime.portal.service.PatternAlertService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@Transactional
public class PatternAlertServiceImpl implements PatternAlertService {

    private final PatternAlertRepository patternAlertRepository;

    public PatternAlertServiceImpl(PatternAlertRepository patternAlertRepository) {
        this.patternAlertRepository = patternAlertRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PatternAlert> getAllAlerts() {
        return patternAlertRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public PatternAlert getAlertById(String id) {
        return patternAlertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pattern alert not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PatternAlert> getAlertsByStatus(String status) {
        return patternAlertRepository.findByStatus(status);
    }

    @Override
    public PatternAlert createAlert(PatternAlert alert) {
        if (alert.getDetectionDate() == null || alert.getDetectionDate().trim().isEmpty()) {
            alert.setDetectionDate(Instant.now().toString());
        }
        if (alert.getStatus() == null || alert.getStatus().trim().isEmpty()) {
            alert.setStatus("UNREVIEWED");
        }
        return patternAlertRepository.save(alert);
    }

    @Override
    public PatternAlert updateAlertStatus(String id, String status) {
        PatternAlert existing = getAlertById(id);
        existing.setStatus(status);
        return patternAlertRepository.save(existing);
    }
}
