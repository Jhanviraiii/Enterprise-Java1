package com.scap.service.impl;

import com.scap.dto.CrimeRecordDto;
import com.scap.entity.CrimeRecord;
import com.scap.entity.CriminalProfile;
import com.scap.entity.FIR;
import com.scap.entity.User;
import com.scap.exception.ResourceNotFoundException;
import com.scap.repository.CrimeRecordRepository;
import com.scap.repository.CriminalProfileRepository;
import com.scap.repository.FirRepository;
import com.scap.repository.UserRepository;
import com.scap.service.CrimeRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CrimeRecordServiceImpl implements CrimeRecordService {

    private final CrimeRecordRepository crimeRecordRepository;
    private final FirRepository firRepository;
    private final UserRepository userRepository;
    private final CriminalProfileRepository criminalProfileRepository;

    @Override
    public List<CrimeRecordDto> getAllCrimeRecords() {
        return crimeRecordRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public CrimeRecordDto getCrimeRecordById(String id) {
        CrimeRecord crimeRecord = crimeRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CrimeRecord", "id", id));
        return mapToDto(crimeRecord);
    }

    @Override
    public CrimeRecordDto getCrimeRecordByCaseNumber(String caseNumber) {
        CrimeRecord crimeRecord = crimeRecordRepository.findByCaseNumber(caseNumber)
                .orElseThrow(() -> new ResourceNotFoundException("CrimeRecord", "caseNumber", caseNumber));
        return mapToDto(crimeRecord);
    }

    @Override
    @Transactional
    public CrimeRecordDto createCrimeRecord(CrimeRecordDto dto) {
        FIR fir = firRepository.findById(dto.getFirId())
                .or(() -> firRepository.findByFirNumber(dto.getFirNumber()))
                .orElseThrow(() -> new ResourceNotFoundException("FIR", "firNumber", dto.getFirNumber()));

        String caseNumber = "CR-" + LocalDateTime.now().getYear() + "-" + (1000 + (int)(Math.random() * 8999));

        CrimeRecord crimeRecord = CrimeRecord.builder()
                .caseNumber(caseNumber)
                .fir(fir)
                .firNumber(fir.getFirNumber())
                .title(dto.getTitle())
                .crimeType(dto.getCrimeType())
                .district(dto.getDistrict())
                .locationAddress(dto.getLocationAddress())
                .mapCoordX(dto.getCoordinates() != null ? dto.getCoordinates().getX() : 50.0)
                .mapCoordY(dto.getCoordinates() != null ? dto.getCoordinates().getY() : 50.0)
                .dateTimeOccurred(LocalDateTime.now())
                .description(dto.getDescription())
                .status(dto.getStatus() != null ? dto.getStatus() : "OPEN")
                .severity(dto.getSeverity() != null ? dto.getSeverity() : "MODERATE")
                .modusOperandi(dto.getModusOperandi() != null ? dto.getModusOperandi() : new ArrayList<>())
                .vehicleDetails(dto.getVehicleDetails())
                .suspectPhoneNumbers(dto.getSuspectPhoneNumbers() != null ? dto.getSuspectPhoneNumbers() : new ArrayList<>())
                .ipAddress(dto.getIpAddress())
                .build();

        CrimeRecord saved = crimeRecordRepository.save(crimeRecord);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public CrimeRecordDto updateCrimeStatus(String id, String status) {
        CrimeRecord crimeRecord = crimeRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CrimeRecord", "id", id));

        crimeRecord.setStatus(status);
        CrimeRecord updated = crimeRecordRepository.save(crimeRecord);
        return mapToDto(updated);
    }

    @Override
    public List<CrimeRecordDto> searchCrimeRecords(String query) {
        return crimeRecordRepository.searchCrimeRecords(query).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private CrimeRecordDto mapToDto(CrimeRecord c) {
        List<String> criminalIds = c.getLinkedCriminals().stream().map(CriminalProfile::getId).collect(Collectors.toList());
        List<String> evidenceIds = c.getEvidenceItems().stream().map(e -> e.getId()).collect(Collectors.toList());
        List<String> victimIds = c.getVictims().stream().map(v -> v.getId()).collect(Collectors.toList());
        List<String> witnessIds = c.getWitnesses().stream().map(w -> w.getId()).collect(Collectors.toList());

        return CrimeRecordDto.builder()
                .id(c.getId())
                .caseNumber(c.getCaseNumber())
                .firId(c.getFir() != null ? c.getFir().getId() : null)
                .firNumber(c.getFirNumber())
                .title(c.getTitle())
                .crimeType(c.getCrimeType())
                .district(c.getDistrict())
                .locationAddress(c.getLocationAddress())
                .coordinates(new CrimeRecordDto.MapCoordinates(c.getMapCoordX(), c.getMapCoordY()))
                .dateTimeOccurred(c.getDateTimeOccurred() != null ? c.getDateTimeOccurred().toString() : null)
                .description(c.getDescription())
                .assignedInvestigatorId(c.getAssignedInvestigator() != null ? c.getAssignedInvestigator().getId() : null)
                .assignedInvestigatorName(c.getAssignedInvestigatorName())
                .status(c.getStatus())
                .severity(c.getSeverity())
                .modusOperandi(c.getModusOperandi())
                .vehicleDetails(c.getVehicleDetails())
                .suspectPhoneNumbers(c.getSuspectPhoneNumbers())
                .ipAddress(c.getIpAddress())
                .linkedCriminalIds(criminalIds)
                .evidenceIds(evidenceIds)
                .victimIds(victimIds)
                .witnessIds(witnessIds)
                .build();
    }
}
