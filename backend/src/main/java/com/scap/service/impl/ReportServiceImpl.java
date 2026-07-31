package com.scap.service.impl;

import com.scap.dto.ReportDto;
import com.scap.entity.Report;
import com.scap.repository.ReportRepository;
import com.scap.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;

    @Override
    public List<ReportDto> getAllReports() {
        return reportRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ReportDto generateReport(String reportType, String title, String generatedBy) {
        String num = "RPT-" + LocalDateTime.now().getYear() + "-" + (1000 + (int)(Math.random() * 8999));

        Report report = Report.builder()
                .reportNumber(num)
                .title(title != null ? title : "Monthly Crime Intelligence Briefing")
                .reportType(reportType != null ? reportType : "EXECUTIVE_SUMMARY")
                .generatedBy(generatedBy != null ? generatedBy : "Director Marcus Vance")
                .generatedDate(LocalDateTime.now())
                .fileFormat("PDF")
                .fileUrl("/reports/generated/" + num + ".pdf")
                .summaryData("Comprehensive breakdown of crimes, evidence integrity logs, and officer resolution metrics.")
                .build();

        Report saved = reportRepository.save(report);
        return mapToDto(saved);
    }

    private ReportDto mapToDto(Report r) {
        return ReportDto.builder()
                .id(r.getId())
                .reportNumber(r.getReportNumber())
                .title(r.getTitle())
                .reportType(r.getReportType())
                .generatedBy(r.getGeneratedBy())
                .generatedDate(r.getGeneratedDate() != null ? r.getGeneratedDate().toString() : null)
                .fileFormat(r.getFileFormat())
                .fileUrl(r.getFileUrl())
                .summaryData(r.getSummaryData())
                .build();
    }
}
