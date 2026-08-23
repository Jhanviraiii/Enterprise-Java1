package com.smartcrime.portal.controller;

import com.smartcrime.portal.dto.ApiResponse;
import com.smartcrime.portal.model.Victim;
import com.smartcrime.portal.service.VictimService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/victims")
public class VictimController {

    private final VictimService victimService;

    public VictimController(VictimService victimService) {
        this.victimService = victimService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Victim>>> getAllVictims() {
        return ResponseEntity.ok(ApiResponse.success("Victims retrieved successfully", victimService.getAllVictims()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Victim>> getVictimById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success("Victim record retrieved", victimService.getVictimById(id)));
    }

    @GetMapping("/case/{caseId}")
    public ResponseEntity<ApiResponse<List<Victim>>> getVictimsByCaseId(@PathVariable String caseId) {
        return ResponseEntity.ok(ApiResponse.success("Case victim records retrieved", victimService.getVictimsByCaseId(caseId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Victim>> createVictim(@RequestBody Victim victim) {
        Victim created = victimService.createVictim(victim);
        return ResponseEntity.status(201).body(ApiResponse.success("Victim record logged", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Victim>> updateVictim(@PathVariable String id, @RequestBody Victim victim) {
        Victim updated = victimService.updateVictim(id, victim);
        return ResponseEntity.ok(ApiResponse.success("Victim record updated", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteVictim(@PathVariable String id) {
        victimService.deleteVictim(id);
        return ResponseEntity.ok(ApiResponse.success("Victim record deleted", null));
    }
}
