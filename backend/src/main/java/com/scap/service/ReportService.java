package com.scap.service;

import com.scap.dto.ReportDto;
import java.util.List;

public interface ReportService {
    List<ReportDto> getAllReports();
    ReportDto generateReport(String reportType, String title, String generatedBy);
}
