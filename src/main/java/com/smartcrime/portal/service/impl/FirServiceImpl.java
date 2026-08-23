package com.smartcrime.portal.service.impl;

import com.smartcrime.portal.dto.FirDto;
import com.smartcrime.portal.exception.ResourceNotFoundException;
import com.smartcrime.portal.model.FIR;
import com.smartcrime.portal.model.FirVersion;
import com.smartcrime.portal.repository.FirRepository;
import com.smartcrime.portal.service.FirService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class FirServiceImpl implements FirService {

    private final FirRepository firRepository;

    public FirServiceImpl(FirRepository firRepository) {
        this.firRepository = firRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<FIR> getAllFirs() {
        return firRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public FIR getFirById(String id) {
        return firRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FIR not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public FIR getFirByNumber(String firNumber) {
        return firRepository.findByFirNumber(firNumber)
                .orElseThrow(() -> new ResourceNotFoundException("FIR not found with number: " + firNumber));
    }

    @Override
    public FIR createFir(FirDto firDto) {
        FIR fir = new FIR();
        if (firDto.getId() != null && !firDto.getId().trim().isEmpty()) {
            fir.setId(firDto.getId());
        }
        fir.setFirNumber(firDto.getFirNumber() != null ? firDto.getFirNumber() : "FIR-2026-" + Math.round(Math.random() * 90000 + 10000));
        fir.setTitle(firDto.getTitle());
        fir.setIncidentType(firDto.getIncidentType());
        fir.setComplainantName(firDto.getComplainantName());
        fir.setComplainantContact(firDto.getComplainantContact());
        fir.setDistrict(firDto.getDistrict());
        fir.setLocationDetails(firDto.getLocationDetails());
        fir.setIncidentDateTime(firDto.getIncidentDateTime());
        fir.setFiledDateTime(firDto.getFiledDateTime() != null ? firDto.getFiledDateTime() : Instant.now().toString());
        fir.setPriority(firDto.getPriority() != null ? firDto.getPriority() : "MEDIUM");
        fir.setStatus(firDto.getStatus() != null ? firDto.getStatus() : "FILED");
        fir.setDescription(firDto.getDescription());
        fir.setReportingOfficerId(firDto.getReportingOfficerId());
        fir.setReportingOfficerName(firDto.getReportingOfficerName());

        // Create initial history entry
        FirVersion initialVersion = new FirVersion();
        initialVersion.setId(UUID.randomUUID().toString());
        initialVersion.setTimestamp(Instant.now().toString());
        initialVersion.setUpdatedBy(firDto.getReportingOfficerName() != null ? firDto.getReportingOfficerName() : "System");
        initialVersion.setChangesSummary("Initial FIR Filed");
        initialVersion.setStatus(fir.getStatus());
        fir.getHistory().add(initialVersion);

        return firRepository.save(fir);
    }

    @Override
    public FIR updateFirStatus(String id, String status, String note) {
        FIR existingFir = getFirById(id);
        existingFir.setStatus(status);

        FirVersion version = new FirVersion();
        version.setId(UUID.randomUUID().toString());
        version.setTimestamp(Instant.now().toString());
        version.setUpdatedBy("Officer");
        version.setChangesSummary(note != null ? note : "Status updated to " + status);
        version.setStatus(status);
        existingFir.getHistory().add(version);

        return firRepository.save(existingFir);
    }
}
