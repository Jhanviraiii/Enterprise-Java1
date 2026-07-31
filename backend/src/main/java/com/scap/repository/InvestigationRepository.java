package com.scap.repository;

import com.scap.entity.Investigation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvestigationRepository extends JpaRepository<Investigation, String> {

    Optional<Investigation> findByCaseNumber(String caseNumber);

    Optional<Investigation> findByCrimeRecordId(String caseId);

    List<Investigation> findByStatus(String status);

    List<Investigation> findByLeadInvestigatorId(String investigatorId);
}
