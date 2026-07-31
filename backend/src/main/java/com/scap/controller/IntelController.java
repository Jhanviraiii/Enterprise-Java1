package com.scap.controller;

import com.scap.entity.IPAddress;
import com.scap.entity.ServerLog;
import com.scap.entity.ThreatDetection;
import com.scap.service.IntelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/intel")
@RequiredArgsConstructor
public class IntelController {

    private final IntelService intelService;

    @GetMapping("/ip-trace")
    public ResponseEntity<IPAddress> traceIp(@RequestParam String ip) {
        return ResponseEntity.ok(intelService.traceIp(ip));
    }

    @GetMapping("/logs")
    public ResponseEntity<List<ServerLog>> getAllServerLogs() {
        return ResponseEntity.ok(intelService.getAllServerLogs());
    }

    @GetMapping("/threats")
    public ResponseEntity<List<ThreatDetection>> getThreatDetections() {
        return ResponseEntity.ok(intelService.getThreatDetections());
    }

    @PostMapping("/analyze-payload")
    public ResponseEntity<ServerLog> analyzePayload(
            @RequestParam String sourceIp,
            @RequestBody String payload) {
        return ResponseEntity.ok(intelService.analyzePayload(sourceIp, payload));
    }
}
