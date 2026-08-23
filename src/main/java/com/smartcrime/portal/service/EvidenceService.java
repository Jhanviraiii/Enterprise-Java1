package com.smartcrime.portal.service;

import com.smartcrime.portal.model.EvidenceItem;

import java.util.List;

public interface EvidenceService {
    List<EvidenceItem> getAllEvidence();
    EvidenceItem getEvidenceById(String id);
    List<EvidenceItem> getEvidenceByCaseId(String caseId);
    EvidenceItem createEvidence(EvidenceItem evidenceItem);
}
