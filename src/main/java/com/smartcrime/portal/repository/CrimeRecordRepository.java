package com.smartcrime.portal.repository;

import com.smartcrime.portal.model.CrimeRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CrimeRecordRepository extends JpaRepository<CrimeRecord, String> {
    Optional<CrimeRecord> findByCaseNumber(String caseNumber);
    Optional<CrimeRecord> findByFirNumber(String firNumber);
    List<CrimeRecord> findByDistrict(String district);
    List<CrimeRecord> findByStatus(String status);
}
