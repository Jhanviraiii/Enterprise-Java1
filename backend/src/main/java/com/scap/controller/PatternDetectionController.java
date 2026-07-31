package com.scap.controller;

import com.scap.dto.PatternAlertDto;
import com.scap.dto.PatternMatchStatsDto;
import com.scap.service.PatternDetectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/patterns")
@RequiredArgsConstructor
public class PatternDetectionController {

    private final PatternDetectionService patternDetectionService;

    @GetMapping
    public ResponseEntity<List<PatternAlertDto>> getAllPatternAlerts() {
        return ResponseEntity.ok(patternDetectionService.getAllPatternAlerts());
    }

    @GetMapping("/stats")
    public ResponseEntity<PatternMatchStatsDto> getPatternMatchStats() {
        return ResponseEntity.ok(patternDetectionService.getPatternMatchStats());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatternAlertDto> getAlertById(@PathVariable String id) {
        return ResponseEntity.ok(patternDetectionService.getAlertById(id));
    }

    @PostMapping("/{id}/confirm")
    public ResponseEntity<PatternAlertDto> confirmAlert(@PathVariable String id) {
        return ResponseEntity.ok(patternDetectionService.confirmAlert(id));
    }

    @PostMapping("/{id}/dismiss")
    public ResponseEntity<PatternAlertDto> dismissAlert(@PathVariable String id) {
        return ResponseEntity.ok(patternDetectionService.dismissAlert(id));
    }

    @PostMapping("/scan")
    public ResponseEntity<PatternAlertDto> runPatternScan() {
        return ResponseEntity.ok(patternDetectionService.runPatternScan());
    }
}
