package com.scap.controller;

import com.scap.dto.FirDto;
import com.scap.service.FirService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/firs")
@RequiredArgsConstructor
public class FirController {

    private final FirService firService;

    @GetMapping
    public ResponseEntity<List<FirDto>> getAllFirs() {
        return ResponseEntity.ok(firService.getAllFirs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FirDto> getFirById(@PathVariable String id) {
        return ResponseEntity.ok(firService.getFirById(id));
    }

    @GetMapping("/number/{firNumber}")
    public ResponseEntity<FirDto> getFirByNumber(@PathVariable String firNumber) {
        return ResponseEntity.ok(firService.getFirByNumber(firNumber));
    }

    @PostMapping
    public ResponseEntity<FirDto> createFir(
            @Valid @RequestBody FirDto firDto,
            @RequestParam(required = false, defaultValue = "BADGE-4420") String reportingOfficerBadge) {
        return new ResponseEntity<>(firService.createFir(firDto, reportingOfficerBadge), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<FirDto> updateStatus(
            @PathVariable String id,
            @RequestParam String status,
            @RequestParam(required = false) String note,
            @RequestParam(required = false) String updatedBy) {
        return ResponseEntity.ok(firService.updateFirStatus(id, status, note, updatedBy));
    }

    @GetMapping("/search")
    public ResponseEntity<List<FirDto>> searchFirs(@RequestParam String query) {
        return ResponseEntity.ok(firService.searchFirs(query));
    }
}
