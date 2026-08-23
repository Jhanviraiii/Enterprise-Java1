package com.smartcrime.portal.controller;

import com.smartcrime.portal.dto.ApiResponse;
import com.smartcrime.portal.model.EvidenceItem;
import com.smartcrime.portal.service.EvidenceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/evidence")
public class EvidenceController {

    private final EvidenceService evidenceService;

    public EvidenceController(EvidenceService evidenceService) {
        this.evidenceService = evidenceService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EvidenceItem>>> getAllEvidence() {
        return ResponseEntity.ok(ApiResponse.success("Evidence items retrieved successfully", evidenceService.getAllEvidence()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EvidenceItem>> getEvidenceById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success("Evidence dossier retrieved", evidenceService.getEvidenceById(id)));
    }

    @GetMapping("/case/{caseId}")
    public ResponseEntity<ApiResponse<List<EvidenceItem>>> getEvidenceByCaseId(@PathVariable String caseId) {
        return ResponseEntity.ok(ApiResponse.success("Case evidence items retrieved", evidenceService.getEvidenceByCaseId(caseId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EvidenceItem>> uploadEvidence(@RequestBody EvidenceItem evidenceItem) {
        EvidenceItem created = evidenceService.createEvidence(evidenceItem);
        return ResponseEntity.status(201).body(ApiResponse.success("Evidence item logged into vault", created));
    }
}
