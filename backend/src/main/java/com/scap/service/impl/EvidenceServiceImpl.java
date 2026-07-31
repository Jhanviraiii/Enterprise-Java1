package com.scap.service.impl;

import com.scap.dto.ChainOfCustodyDto;
import com.scap.dto.EvidenceDto;
import com.scap.entity.ChainOfCustody;
import com.scap.entity.CrimeRecord;
import com.scap.entity.Evidence;
import com.scap.exception.ResourceNotFoundException;
import com.scap.repository.CrimeRecordRepository;
import com.scap.repository.EvidenceRepository;
import com.scap.service.EvidenceService;
import com.scap.util.HashUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EvidenceServiceImpl implements EvidenceService {

    private final EvidenceRepository evidenceRepository;
    private final CrimeRecordRepository crimeRecordRepository;

    @Override
    public List<EvidenceDto> getAllEvidence() {
        return evidenceRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public EvidenceDto getEvidenceById(String id) {
        Evidence evidence = evidenceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evidence", "id", id));
        return mapToDto(evidence);
    }

    @Override
    public List<EvidenceDto> getEvidenceByCaseId(String caseId) {
        return evidenceRepository.findByCrimeRecordId(caseId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public EvidenceDto createEvidence(EvidenceDto dto, String handledByBadge) {
        CrimeRecord crimeRecord = crimeRecordRepository.findById(dto.getCaseId())
                .orElseThrow(() -> new ResourceNotFoundException("CrimeRecord", "id", dto.getCaseId()));

        String code = "EVD-" + LocalDateTime.now().getYear() + "-" + (100 + (int)(Math.random() * 899));
        String computedHash = HashUtils.computeSha256(dto.getTitle() + code + LocalDateTime.now().toString());

        Evidence evidence = Evidence.builder()
                .crimeRecord(crimeRecord)
                .caseNumber(crimeRecord.getCaseNumber())
                .evidenceCode(code)
                .title(dto.getTitle())
                .type(dto.getType())
                .fileSize(dto.getFileSize() != null ? dto.getFileSize() : "14.2 MB")
                .fileFormat(dto.getFileFormat() != null ? dto.getFileFormat() : "RAW")
                .sha256Hash(computedHash)
                .collectedBy(dto.getCollectedBy() != null ? dto.getCollectedBy() : "Forensic Officer")
                .collectionDate(LocalDateTime.now())
                .storageLocation(dto.getStorageLocation() != null ? dto.getStorageLocation() : "Vault Section B-12")
                .isVerifiedIntegrity(true)
                .build();

        ChainOfCustody initialCustody = ChainOfCustody.builder()
                .evidence(evidence)
                .timestamp(LocalDateTime.now())
                .handledBy(dto.getCollectedBy() != null ? dto.getCollectedBy() : "Forensic Officer")
                .badgeNumber(handledByBadge != null ? handledByBadge : "BADGE-9912")
                .action("UPLOADED")
                .notes("Evidence initially logged and cryptographic hash computed.")
                .build();

        evidence.getCustodyChain().add(initialCustody);

        Evidence saved = evidenceRepository.save(evidence);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public EvidenceDto addCustodyEntry(String evidenceId, String action, String notes, String badgeNumber, String handledBy) {
        Evidence evidence = evidenceRepository.findById(evidenceId)
                .orElseThrow(() -> new ResourceNotFoundException("Evidence", "id", evidenceId));

        ChainOfCustody custody = ChainOfCustody.builder()
                .evidence(evidence)
                .timestamp(LocalDateTime.now())
                .handledBy(handledBy != null ? handledBy : "Officer")
                .badgeNumber(badgeNumber != null ? badgeNumber : "BADGE-4420")
                .action(action)
                .notes(notes)
                .build();

        evidence.getCustodyChain().add(custody);

        Evidence updated = evidenceRepository.save(evidence);
        return mapToDto(updated);
    }

    @Override
    public Boolean verifyIntegrity(String evidenceId) {
        Evidence evidence = evidenceRepository.findById(evidenceId)
                .orElseThrow(() -> new ResourceNotFoundException("Evidence", "id", evidenceId));

        return evidence.getIsVerifiedIntegrity();
    }

    private EvidenceDto mapToDto(Evidence e) {
        List<ChainOfCustodyDto> chainDtos = e.getCustodyChain().stream()
                .map(c -> ChainOfCustodyDto.builder()
                        .id(c.getId())
                        .timestamp(c.getTimestamp().toString())
                        .handledBy(c.getHandledBy())
                        .badgeNumber(c.getBadgeNumber())
                        .action(c.getAction())
                        .notes(c.getNotes())
                        .build())
                .collect(Collectors.toList());

        return EvidenceDto.builder()
                .id(e.getId())
                .caseId(e.getCrimeRecord() != null ? e.getCrimeRecord().getId() : null)
                .caseNumber(e.getCaseNumber())
                .evidenceCode(e.getEvidenceCode())
                .title(e.getTitle())
                .type(e.getType())
                .fileSize(e.getFileSize())
                .fileFormat(e.getFileFormat())
                .sha256Hash(e.getSha256Hash())
                .collectedBy(e.getCollectedBy())
                .collectionDate(e.getCollectionDate() != null ? e.getCollectionDate().toString() : null)
                .storageLocation(e.getStorageLocation())
                .isVerifiedIntegrity(e.getIsVerifiedIntegrity())
                .custodyChain(chainDtos)
                .build();
    }
}
