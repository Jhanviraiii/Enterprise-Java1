package com.scap.controller;

import com.scap.dto.CriminalProfileDto;
import com.scap.service.CriminalProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/criminals")
@RequiredArgsConstructor
public class CriminalProfileController {

    private final CriminalProfileService criminalProfileService;

    @GetMapping
    public ResponseEntity<List<CriminalProfileDto>> getAllCriminals() {
        return ResponseEntity.ok(criminalProfileService.getAllCriminals());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CriminalProfileDto> getCriminalById(@PathVariable String id) {
        return ResponseEntity.ok(criminalProfileService.getCriminalById(id));
    }

    @PostMapping
    public ResponseEntity<CriminalProfileDto> createCriminal(@Valid @RequestBody CriminalProfileDto dto) {
        return new ResponseEntity<>(criminalProfileService.createCriminal(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CriminalProfileDto> updateCriminal(@PathVariable String id, @Valid @RequestBody CriminalProfileDto dto) {
        return ResponseEntity.ok(criminalProfileService.updateCriminal(id, dto));
    }

    @GetMapping("/search")
    public ResponseEntity<List<CriminalProfileDto>> searchCriminals(@RequestParam String query) {
        return ResponseEntity.ok(criminalProfileService.searchCriminals(query));
    }
}
