package com.smartcrime.portal.controller;

import com.smartcrime.portal.dto.ApiResponse;
import com.smartcrime.portal.model.Witness;
import com.smartcrime.portal.service.WitnessService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/witnesses")
public class WitnessController {

    private final WitnessService witnessService;

    public WitnessController(WitnessService witnessService) {
        this.witnessService = witnessService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Witness>>> getAllWitnesses() {
        return ResponseEntity.ok(ApiResponse.success("Witnesses retrieved successfully", witnessService.getAllWitnesses()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Witness>> getWitnessById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success("Witness record retrieved", witnessService.getWitnessById(id)));
    }

    @GetMapping("/case/{caseId}")
    public ResponseEntity<ApiResponse<List<Witness>>> getWitnessesByCaseId(@PathVariable String caseId) {
        return ResponseEntity.ok(ApiResponse.success("Case witness records retrieved", witnessService.getWitnessesByCaseId(caseId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Witness>> createWitness(@RequestBody Witness witness) {
        Witness created = witnessService.createWitness(witness);
        return ResponseEntity.status(201).body(ApiResponse.success("Witness record logged", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Witness>> updateWitness(@PathVariable String id, @RequestBody Witness witness) {
        Witness updated = witnessService.updateWitness(id, witness);
        return ResponseEntity.ok(ApiResponse.success("Witness record updated", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteWitness(@PathVariable String id) {
        witnessService.deleteWitness(id);
        return ResponseEntity.ok(ApiResponse.success("Witness record deleted", null));
    }
}
