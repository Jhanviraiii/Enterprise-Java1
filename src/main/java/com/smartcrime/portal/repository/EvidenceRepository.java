package com.smartcrime.portal.repository;

import com.smartcrime.portal.model.EvidenceItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EvidenceRepository extends JpaRepository<EvidenceItem, String> {
    Optional<EvidenceItem> findByEvidenceCode(String evidenceCode);
    List<EvidenceItem> findByCaseId(String caseId);
}
