package com.scap.analytics.controller;

import com.scap.analytics.model.FirEntity;
import com.scap.analytics.service.FirService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/firs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "FIR Management Controller", description = "Law Enforcement First Information Report Ingestion & Retrieval")
public class FirController {

    private final FirService firService;

    @GetMapping
    @Operation(summary = "Get all registered FIRs from Cloud DB")
    public ResponseEntity<List<FirEntity>> getAllFirs() {
        try {
            return ResponseEntity.ok(firService.getAllFirs());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get FIR by unique identifier")
    public ResponseEntity<FirEntity> getFirById(@PathVariable String id) {
        try {
            return firService.getFirById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    @Operation(summary = "Register new FIR into Cloud Firestore and relational audit log")
    public ResponseEntity<FirEntity> registerFir(@RequestBody FirEntity fir) {
        try {
            FirEntity saved = firService.saveFir(fir);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/health")
    @Operation(summary = "Microservice health check")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "scap-springboot-backend",
                "cloudDatabase", "Cloud Firestore (Online)",
                "timestamp", System.currentTimeMillis()
        ));
    }
}
