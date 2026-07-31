package com.scap.repository;

import com.scap.entity.Evidence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EvidenceRepository extends JpaRepository<Evidence, String> {

    Optional<Evidence> findByEvidenceCode(String evidenceCode);

    List<Evidence> findByCrimeRecordId(String caseId);

    List<Evidence> findByType(String type);

    @Query("SELECT e FROM Evidence e WHERE " +
           "LOWER(e.evidenceCode) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.caseNumber) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Evidence> searchEvidence(@Param("query") String query);
}
