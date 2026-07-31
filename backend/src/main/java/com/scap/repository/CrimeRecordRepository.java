package com.scap.repository;

import com.scap.entity.CrimeRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CrimeRecordRepository extends JpaRepository<CrimeRecord, String> {

    Optional<CrimeRecord> findByCaseNumber(String caseNumber);

    List<CrimeRecord> findByStatus(String status);

    List<CrimeRecord> findByCrimeType(String crimeType);

    List<CrimeRecord> findByDistrict(String district);

    @Query("SELECT c FROM CrimeRecord c WHERE " +
           "LOWER(c.caseNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.crimeType) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.district) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<CrimeRecord> searchCrimeRecords(@Param("query") String query);
}
