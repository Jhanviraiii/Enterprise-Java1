package com.scap.service;

import com.scap.dto.EvidenceDto;
import java.util.List;

public interface EvidenceService {
    List<EvidenceDto> getAllEvidence();
    EvidenceDto getEvidenceById(String id);
    List<EvidenceDto> getEvidenceByCaseId(String caseId);
    EvidenceDto createEvidence(EvidenceDto dto, String handledByBadge);
    EvidenceDto addCustodyEntry(String evidenceId, String action, String notes, String badgeNumber, String handledBy);
    Boolean verifyIntegrity(String evidenceId);
}
