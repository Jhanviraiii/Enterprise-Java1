package com.scap.controller;

import com.scap.dto.EvidenceDto;
import com.scap.service.EvidenceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/evidence")
@RequiredArgsConstructor
public class EvidenceController {

    private final EvidenceService evidenceService;

    @GetMapping
    public ResponseEntity<List<EvidenceDto>> getAllEvidence() {
        return ResponseEntity.ok(evidenceService.getAllEvidence());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EvidenceDto> getEvidenceById(@PathVariable String id) {
        return ResponseEntity.ok(evidenceService.getEvidenceById(id));
    }

    @GetMapping("/case/{caseId}")
    public ResponseEntity<List<EvidenceDto>> getEvidenceByCaseId(@PathVariable String caseId) {
        return ResponseEntity.ok(evidenceService.getEvidenceByCaseId(caseId));
    }

    @PostMapping
    public ResponseEntity<EvidenceDto> createEvidence(
            @Valid @RequestBody EvidenceDto dto,
            @RequestParam(required = false, defaultValue = "BADGE-9912") String badgeNumber) {
        return new ResponseEntity<>(evidenceService.createEvidence(dto, badgeNumber), HttpStatus.CREATED);
    }

    @PostMapping("/{id}/custody")
    public ResponseEntity<EvidenceDto> addCustodyEntry(
            @PathVariable String id,
            @RequestParam String action,
            @RequestParam String notes,
            @RequestParam(required = false, defaultValue = "BADGE-9912") String badgeNumber,
            @RequestParam(required = false, defaultValue = "Dr. Aris Thorne") String handledBy) {
        return ResponseEntity.ok(evidenceService.addCustodyEntry(id, action, notes, badgeNumber, handledBy));
    }

    @GetMapping("/{id}/verify-hash")
    public ResponseEntity<Boolean> verifyIntegrity(@PathVariable String id) {
        return ResponseEntity.ok(evidenceService.verifyIntegrity(id));
    }
}
