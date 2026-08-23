package com.smartcrime.portal.controller;

import com.smartcrime.portal.dto.ApiResponse;
import com.smartcrime.portal.dto.FirDto;
import com.smartcrime.portal.model.FIR;
import com.smartcrime.portal.service.FirService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/firs")
public class FirController {

    private final FirService firService;

    public FirController(FirService firService) {
        this.firService = firService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FIR>>> getAllFirs() {
        return ResponseEntity.ok(ApiResponse.success("FIR list retrieved successfully", firService.getAllFirs()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FIR>> getFirById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success("FIR dossier retrieved", firService.getFirById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FIR>> createFir(@Valid @RequestBody FirDto firDto) {
        FIR created = firService.createFir(firDto);
        return ResponseEntity.status(201).body(ApiResponse.success("FIR filed successfully", created));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<FIR>> updateFirStatus(
            @PathVariable String id,
            @RequestParam String status,
            @RequestParam(required = false) String note) {
        FIR updated = firService.updateFirStatus(id, status, note);
        return ResponseEntity.ok(ApiResponse.success("FIR status updated successfully", updated));
    }
}
