package com.scap.controller;

import com.scap.dto.CrimeRecordDto;
import com.scap.service.CrimeRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/crimes")
@RequiredArgsConstructor
public class CrimeRecordController {

    private final CrimeRecordService crimeRecordService;

    @GetMapping
    public ResponseEntity<List<CrimeRecordDto>> getAllCrimeRecords() {
        return ResponseEntity.ok(crimeRecordService.getAllCrimeRecords());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CrimeRecordDto> getCrimeRecordById(@PathVariable String id) {
        return ResponseEntity.ok(crimeRecordService.getCrimeRecordById(id));
    }

    @GetMapping("/case/{caseNumber}")
    public ResponseEntity<CrimeRecordDto> getCrimeRecordByCaseNumber(@PathVariable String caseNumber) {
        return ResponseEntity.ok(crimeRecordService.getCrimeRecordByCaseNumber(caseNumber));
    }

    @PostMapping
    public ResponseEntity<CrimeRecordDto> createCrimeRecord(@Valid @RequestBody CrimeRecordDto dto) {
        return new ResponseEntity<>(crimeRecordService.createCrimeRecord(dto), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<CrimeRecordDto> updateStatus(@PathVariable String id, @RequestParam String status) {
        return ResponseEntity.ok(crimeRecordService.updateCrimeStatus(id, status));
    }

    @GetMapping("/search")
    public ResponseEntity<List<CrimeRecordDto>> searchCrimeRecords(@RequestParam String query) {
        return ResponseEntity.ok(crimeRecordService.searchCrimeRecords(query));
    }
}
