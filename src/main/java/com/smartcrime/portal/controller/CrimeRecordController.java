package com.smartcrime.portal.controller;

import com.smartcrime.portal.dto.ApiResponse;
import com.smartcrime.portal.model.CrimeRecord;
import com.smartcrime.portal.service.CrimeRecordService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/crimes")
public class CrimeRecordController {

    private final CrimeRecordService crimeRecordService;

    public CrimeRecordController(CrimeRecordService crimeRecordService) {
        this.crimeRecordService = crimeRecordService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CrimeRecord>>> getAllCrimeRecords() {
        return ResponseEntity.ok(ApiResponse.success("Crime records retrieved successfully", crimeRecordService.getAllCrimeRecords()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CrimeRecord>> getCrimeRecordById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success("Crime record dossier retrieved", crimeRecordService.getCrimeRecordById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CrimeRecord>> createCrimeRecord(@RequestBody CrimeRecord crimeRecord) {
        CrimeRecord created = crimeRecordService.createCrimeRecord(crimeRecord);
        return ResponseEntity.status(201).body(ApiResponse.success("Crime record logged successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CrimeRecord>> updateCrimeRecord(@PathVariable String id, @RequestBody CrimeRecord crimeRecord) {
        CrimeRecord updated = crimeRecordService.updateCrimeRecord(id, crimeRecord);
        return ResponseEntity.ok(ApiResponse.success("Crime record updated successfully", updated));
    }
}
