package com.smartcrime.portal.repository;

import com.smartcrime.portal.model.InvestigationNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvestigationNoteRepository extends JpaRepository<InvestigationNote, String> {
    List<InvestigationNote> findByCaseId(String caseId);
}
