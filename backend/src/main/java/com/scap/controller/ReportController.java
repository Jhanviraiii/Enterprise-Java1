package com.scap.controller;

import com.scap.dto.ReportDto;
import com.scap.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping
    public ResponseEntity<List<ReportDto>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    @PostMapping("/generate")
    public ResponseEntity<ReportDto> generateReport(
            @RequestParam(required = false) String reportType,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String generatedBy) {
        return new ResponseEntity<>(reportService.generateReport(reportType, title, generatedBy), HttpStatus.CREATED);
    }
}
