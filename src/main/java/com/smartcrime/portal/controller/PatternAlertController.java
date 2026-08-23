package com.smartcrime.portal.controller;

import com.smartcrime.portal.dto.ApiResponse;
import com.smartcrime.portal.model.PatternAlert;
import com.smartcrime.portal.service.PatternAlertService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/alerts")
public class PatternAlertController {

    private final PatternAlertService patternAlertService;

    public PatternAlertController(PatternAlertService patternAlertService) {
        this.patternAlertService = patternAlertService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PatternAlert>>> getAllAlerts(@RequestParam(required = false) String status) {
        List<PatternAlert> alerts = (status != null && !status.trim().isEmpty())
                ? patternAlertService.getAlertsByStatus(status)
                : patternAlertService.getAllAlerts();
        return ResponseEntity.ok(ApiResponse.success("Pattern alerts retrieved", alerts));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PatternAlert>> getAlertById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success("Pattern alert dossier retrieved", patternAlertService.getAlertById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PatternAlert>> createAlert(@RequestBody PatternAlert alert) {
        PatternAlert created = patternAlertService.createAlert(alert);
        return ResponseEntity.status(201).body(ApiResponse.success("Pattern alert generated", created));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<PatternAlert>> updateAlertStatus(@PathVariable String id, @RequestParam String status) {
        PatternAlert updated = patternAlertService.updateAlertStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Pattern alert status updated", updated));
    }
}
