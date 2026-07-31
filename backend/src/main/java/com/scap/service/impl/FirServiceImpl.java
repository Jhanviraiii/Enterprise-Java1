package com.scap.service.impl;

import com.scap.dto.FirDto;
import com.scap.dto.FirVersionDto;
import com.scap.entity.District;
import com.scap.entity.FIR;
import com.scap.entity.FIRHistory;
import com.scap.entity.User;
import com.scap.exception.ResourceNotFoundException;
import com.scap.repository.DistrictRepository;
import com.scap.repository.FirRepository;
import com.scap.repository.UserRepository;
import com.scap.service.FirService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FirServiceImpl implements FirService {

    private final FirRepository firRepository;
    private final DistrictRepository districtRepository;
    private final UserRepository userRepository;

    @Override
    public List<FirDto> getAllFirs() {
        return firRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public FirDto getFirById(String id) {
        FIR fir = firRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FIR", "id", id));
        return mapToDto(fir);
    }

    @Override
    public FirDto getFirByNumber(String firNumber) {
        FIR fir = firRepository.findByFirNumber(firNumber)
                .orElseThrow(() -> new ResourceNotFoundException("FIR", "firNumber", firNumber));
        return mapToDto(fir);
    }

    @Override
    @Transactional
    public FirDto createFir(FirDto firDto, String reportingUserBadge) {
        User reportingOfficer = userRepository.findByBadgeNumber(reportingUserBadge)
                .orElseGet(() -> userRepository.findAll().stream().findFirst().orElseThrow());

        District district = districtRepository.findByName(firDto.getDistrict())
                .orElseGet(() -> districtRepository.save(District.builder().name(firDto.getDistrict()).state("Metro State").build()));

        String generatedFirNumber = "FIR-" + LocalDateTime.now().getYear() + "-" + (10000 + (int)(Math.random() * 89999));

        FIR fir = FIR.builder()
                .firNumber(generatedFirNumber)
                .title(firDto.getTitle())
                .incidentType(firDto.getIncidentType())
                .complainantName(firDto.getComplainantName())
                .complainantContact(firDto.getComplainantContact())
                .district(district)
                .districtName(district.getName())
                .locationDetails(firDto.getLocationDetails())
                .incidentDateTime(LocalDateTime.now())
                .filedDateTime(LocalDateTime.now())
                .priority(firDto.getPriority() != null ? firDto.getPriority() : "MEDIUM")
                .status("FILED")
                .description(firDto.getDescription())
                .reportingOfficer(reportingOfficer)
                .reportingOfficerName(reportingOfficer.getName())
                .build();

        FIRHistory initialHistory = FIRHistory.builder()
                .fir(fir)
                .timestamp(LocalDateTime.now())
                .updatedBy(reportingOfficer.getName())
                .changesSummary("Initial FIR filed via SCAP Terminal.")
                .status("FILED")
                .build();

        fir.getHistory().add(initialHistory);

        FIR savedFir = firRepository.save(fir);
        return mapToDto(savedFir);
    }

    @Override
    @Transactional
    public FirDto updateFirStatus(String id, String status, String note, String updatedBy) {
        FIR fir = firRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FIR", "id", id));

        fir.setStatus(status);

        FIRHistory historyEntry = FIRHistory.builder()
                .fir(fir)
                .timestamp(LocalDateTime.now())
                .updatedBy(updatedBy != null ? updatedBy : "System Officer")
                .changesSummary(note != null ? note : "FIR status updated to " + status)
                .status(status)
                .build();

        fir.getHistory().add(historyEntry);

        FIR updatedFir = firRepository.save(fir);
        return mapToDto(updatedFir);
    }

    @Override
    public List<FirDto> searchFirs(String query) {
        return firRepository.searchFirs(query).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private FirDto mapToDto(FIR fir) {
        List<FirVersionDto> historyDtos = fir.getHistory().stream()
                .map(h -> FirVersionDto.builder()
                        .id(h.getId())
                        .timestamp(h.getTimestamp().toString())
                        .updatedBy(h.getUpdatedBy())
                        .changesSummary(h.getChangesSummary())
                        .status(h.getStatus())
                        .build())
                .collect(Collectors.toList());

        return FirDto.builder()
                .id(fir.getId())
                .firNumber(fir.getFirNumber())
                .title(fir.getTitle())
                .incidentType(fir.getIncidentType())
                .complainantName(fir.getComplainantName())
                .complainantContact(fir.getComplainantContact())
                .district(fir.getDistrictName())
                .locationDetails(fir.getLocationDetails())
                .incidentDateTime(fir.getIncidentDateTime() != null ? fir.getIncidentDateTime().toString() : null)
                .filedDateTime(fir.getFiledDateTime() != null ? fir.getFiledDateTime().toString() : null)
                .priority(fir.getPriority())
                .status(fir.getStatus())
                .description(fir.getDescription())
                .reportingOfficerId(fir.getReportingOfficer() != null ? fir.getReportingOfficer().getId() : null)
                .reportingOfficerName(fir.getReportingOfficerName())
                .assignedInvestigatorId(fir.getAssignedInvestigator() != null ? fir.getAssignedInvestigator().getId() : null)
                .assignedInvestigatorName(fir.getAssignedInvestigatorName())
                .history(historyDtos)
                .build();
    }
}
