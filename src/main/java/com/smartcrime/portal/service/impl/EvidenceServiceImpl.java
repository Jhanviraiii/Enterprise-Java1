package com.smartcrime.portal.service.impl;

import com.smartcrime.portal.exception.ResourceNotFoundException;
import com.smartcrime.portal.model.EvidenceItem;
import com.smartcrime.portal.repository.EvidenceRepository;
import com.smartcrime.portal.service.EvidenceService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class EvidenceServiceImpl implements EvidenceService {

    private final EvidenceRepository evidenceRepository;

    public EvidenceServiceImpl(EvidenceRepository evidenceRepository) {
        this.evidenceRepository = evidenceRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<EvidenceItem> getAllEvidence() {
        return evidenceRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public EvidenceItem getEvidenceById(String id) {
        return evidenceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evidence item not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<EvidenceItem> getEvidenceByCaseId(String caseId) {
        return evidenceRepository.findByCaseId(caseId);
    }

    @Override
    public EvidenceItem createEvidence(EvidenceItem evidenceItem) {
        if (evidenceItem.getEvidenceCode() == null || evidenceItem.getEvidenceCode().trim().isEmpty()) {
            evidenceItem.setEvidenceCode("EVD-2026-" + Math.round(Math.random() * 900 + 100));
        }
        return evidenceRepository.save(evidenceItem);
    }
}
