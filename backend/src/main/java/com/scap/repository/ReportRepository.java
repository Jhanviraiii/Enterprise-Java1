package com.scap.repository;

import com.scap.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReportRepository extends JpaRepository<Report, String> {
    Optional<Report> findByReportNumber(String reportNumber);
    List<Report> findByReportType(String reportType);
}
