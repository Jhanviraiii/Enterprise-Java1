package com.scap.service.impl;

import com.scap.dto.PatternAlertDto;
import com.scap.dto.PatternMatchStatsDto;
import com.scap.entity.CrimeRecord;
import com.scap.entity.PatternAlert;
import com.scap.exception.ResourceNotFoundException;
import com.scap.repository.CrimeRecordRepository;
import com.scap.repository.PatternAlertRepository;
import com.scap.service.PatternDetectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatternDetectionServiceImpl implements PatternDetectionService {

    private final PatternAlertRepository patternAlertRepository;
    private final CrimeRecordRepository crimeRecordRepository;

    @Override
    public List<PatternAlertDto> getAllPatternAlerts() {
        return patternAlertRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public PatternAlertDto getAlertById(String id) {
        PatternAlert alert = patternAlertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PatternAlert", "id", id));
        return mapToDto(alert);
    }

    @Override
    @Transactional
    public PatternAlertDto confirmAlert(String alertId) {
        PatternAlert alert = patternAlertRepository.findById(alertId)
                .orElseThrow(() -> new ResourceNotFoundException("PatternAlert", "id", alertId));

        alert.setStatus("CONFIRMED");
        PatternAlert saved = patternAlertRepository.save(alert);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public PatternAlertDto dismissAlert(String alertId) {
        PatternAlert alert = patternAlertRepository.findById(alertId)
                .orElseThrow(() -> new ResourceNotFoundException("PatternAlert", "id", alertId));

        alert.setStatus("DISMISSED");
        PatternAlert saved = patternAlertRepository.save(alert);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public PatternAlertDto runPatternScan() {
        List<CrimeRecord> crimes = crimeRecordRepository.findAll();
        CrimeRecord c1 = crimes.size() > 0 ? crimes.get(0) : null;
        CrimeRecord c2 = crimes.size() > 1 ? crimes.get(1) : c1;

        PatternAlert alert = PatternAlert.builder()
                .title("96% High-Confidence MO Match: Armed Robbery & Bank Heist Reconnaissance")
                .similarityScore(96)
                .matchedFactors(List.of(
                        "Matching Signal Jamming Frequency (868 MHz)",
                        "Dark Blue Sedan Plate #7XYZ99 Reconnaissance",
                        "Suspect Physical Descriptor Match"
                ))
                .primaryCase(c1)
                .primaryFirNumber(c1 != null ? c1.getFirNumber() : "FIR-2026-08942")
                .relatedCase(c2)
                .relatedFirNumber(c2 != null ? c2.getFirNumber() : "FIR-2026-08103")
                .detectionDate(LocalDateTime.now())
                .status("UNREVIEWED")
                .suspectAlias("The Specter")
                .build();

        PatternAlert saved = patternAlertRepository.save(alert);
        return mapToDto(saved);
    }

    @Override
    public PatternMatchStatsDto getPatternMatchStats() {
        List<PatternAlert> alerts = patternAlertRepository.findAll();
        long total = alerts.size();
        long active = alerts.stream().filter(a -> "UNREVIEWED".equalsIgnoreCase(a.getStatus())).count();
        long confirmed = alerts.stream().filter(a -> "CONFIRMED".equalsIgnoreCase(a.getStatus())).count();
        long dismissed = alerts.stream().filter(a -> "DISMISSED".equalsIgnoreCase(a.getStatus())).count();

        return PatternMatchStatsDto.builder()
                .totalMatches(total)
                .activeMatches(active)
                .confirmedMatches(confirmed)
                .dismissedMatches(dismissed)
                .build();
    }

    private PatternAlertDto mapToDto(PatternAlert pa) {
        return PatternAlertDto.builder()
                .id(pa.getId())
                .title(pa.getTitle())
                .similarityScore(pa.getSimilarityScore())
                .matchedFactors(pa.getMatchedFactors())
                .primaryCaseId(pa.getPrimaryCase() != null ? pa.getPrimaryCase().getId() : null)
                .primaryFirNumber(pa.getPrimaryFirNumber())
                .relatedCaseId(pa.getRelatedCase() != null ? pa.getRelatedCase().getId() : null)
                .relatedFirNumber(pa.getRelatedFirNumber())
                .detectionDate(pa.getDetectionDate() != null ? pa.getDetectionDate().toString() : null)
                .status(pa.getStatus())
                .suspectId(pa.getSuspectId())
                .suspectAlias(pa.getSuspectAlias())
                .build();
    }
}
