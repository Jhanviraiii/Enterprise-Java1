package com.scap.analytics.controller;

import com.scap.analytics.model.SuspectEntity;
import com.scap.analytics.service.SuspectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/suspects")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Suspect Intelligence Controller", description = "Biometric, alias, and MO suspect dossier management")
public class SuspectController {

    private final SuspectService suspectService;

    @GetMapping
    @Operation(summary = "Get all tracked suspect dossiers")
    public ResponseEntity<List<SuspectEntity>> getAllSuspects() {
        try {
            return ResponseEntity.ok(suspectService.getAllSuspects());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get suspect dossier by ID")
    public ResponseEntity<SuspectEntity> getSuspectById(@PathVariable String id) {
        try {
            return suspectService.getSuspectById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    @Operation(summary = "Create or update suspect dossier")
    public ResponseEntity<SuspectEntity> saveSuspect(@RequestBody SuspectEntity suspect) {
        try {
            return ResponseEntity.ok(suspectService.saveSuspect(suspect));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
