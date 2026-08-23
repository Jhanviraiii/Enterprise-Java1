package com.smartcrime.portal.service.impl;

import com.smartcrime.portal.exception.ResourceNotFoundException;
import com.smartcrime.portal.model.CrimeRecord;
import com.smartcrime.portal.repository.CrimeRecordRepository;
import com.smartcrime.portal.service.CrimeRecordService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CrimeRecordServiceImpl implements CrimeRecordService {

    private final CrimeRecordRepository crimeRecordRepository;

    public CrimeRecordServiceImpl(CrimeRecordRepository crimeRecordRepository) {
        this.crimeRecordRepository = crimeRecordRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CrimeRecord> getAllCrimeRecords() {
        return crimeRecordRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public CrimeRecord getCrimeRecordById(String id) {
        return crimeRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Crime record not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public CrimeRecord getCrimeRecordByCaseNumber(String caseNumber) {
        return crimeRecordRepository.findByCaseNumber(caseNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Crime record not found with case number: " + caseNumber));
    }

    @Override
    public CrimeRecord createCrimeRecord(CrimeRecord crimeRecord) {
        if (crimeRecord.getCaseNumber() == null || crimeRecord.getCaseNumber().trim().isEmpty()) {
            crimeRecord.setCaseNumber("CR-2026-" + Math.round(Math.random() * 9000 + 1000));
        }
        return crimeRecordRepository.save(crimeRecord);
    }

    @Override
    public CrimeRecord updateCrimeRecord(String id, CrimeRecord updated) {
        CrimeRecord existing = getCrimeRecordById(id);
        if (updated.getTitle() != null) existing.setTitle(updated.getTitle());
        if (updated.getCrimeType() != null) existing.setCrimeType(updated.getCrimeType());
        if (updated.getDistrict() != null) existing.setDistrict(updated.getDistrict());
        if (updated.getLocationAddress() != null) existing.setLocationAddress(updated.getLocationAddress());
        if (updated.getCoordinates() != null) existing.setCoordinates(updated.getCoordinates());
        if (updated.getDateTimeOccurred() != null) existing.setDateTimeOccurred(updated.getDateTimeOccurred());
        if (updated.getDescription() != null) existing.setDescription(updated.getDescription());
        if (updated.getAssignedInvestigatorId() != null) existing.setAssignedInvestigatorId(updated.getAssignedInvestigatorId());
        if (updated.getAssignedInvestigatorName() != null) existing.setAssignedInvestigatorName(updated.getAssignedInvestigatorName());
        if (updated.getStatus() != null) existing.setStatus(updated.getStatus());
        if (updated.getSeverity() != null) existing.setSeverity(updated.getSeverity());
        if (updated.getModusOperandi() != null) existing.setModusOperandi(updated.getModusOperandi());
        if (updated.getVehicleDetails() != null) existing.setVehicleDetails(updated.getVehicleDetails());
        if (updated.getSuspectPhoneNumbers() != null) existing.setSuspectPhoneNumbers(updated.getSuspectPhoneNumbers());
        if (updated.getIpAddress() != null) existing.setIpAddress(updated.getIpAddress());
        if (updated.getLinkedCriminalIds() != null) existing.setLinkedCriminalIds(updated.getLinkedCriminalIds());
        if (updated.getEvidenceIds() != null) existing.setEvidenceIds(updated.getEvidenceIds());
        if (updated.getVictimIds() != null) existing.setVictimIds(updated.getVictimIds());
        if (updated.getWitnessIds() != null) existing.setWitnessIds(updated.getWitnessIds());

        return crimeRecordRepository.save(existing);
    }
}
