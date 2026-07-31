package com.scap.repository;

import com.scap.entity.ForensicReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ForensicReportRepository extends JpaRepository<ForensicReport, String> {
    Optional<ForensicReport> findByReportNumber(String reportNumber);
    List<ForensicReport> findByCrimeRecordId(String caseId);
    List<ForensicReport> findByEvidenceId(String evidenceId);
}
