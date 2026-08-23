package com.smartcrime.portal.controller;

import com.smartcrime.portal.dto.ApiResponse;
import com.smartcrime.portal.model.CriminalProfile;
import com.smartcrime.portal.service.CriminalProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/criminals")
public class CriminalProfileController {

    private final CriminalProfileService criminalProfileService;

    public CriminalProfileController(CriminalProfileService criminalProfileService) {
        this.criminalProfileService = criminalProfileService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CriminalProfile>>> getAllCriminalProfiles() {
        return ResponseEntity.ok(ApiResponse.success("Suspect profiles retrieved successfully", criminalProfileService.getAllCriminalProfiles()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CriminalProfile>> getCriminalProfileById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success("Suspect dossier retrieved", criminalProfileService.getCriminalProfileById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CriminalProfile>> createCriminalProfile(@RequestBody CriminalProfile criminalProfile) {
        CriminalProfile created = criminalProfileService.createCriminalProfile(criminalProfile);
        return ResponseEntity.status(201).body(ApiResponse.success("Suspect profile registered successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CriminalProfile>> updateCriminalProfile(@PathVariable String id, @RequestBody CriminalProfile criminalProfile) {
        CriminalProfile updated = criminalProfileService.updateCriminalProfile(id, criminalProfile);
        return ResponseEntity.ok(ApiResponse.success("Suspect profile updated successfully", updated));
    }
}
