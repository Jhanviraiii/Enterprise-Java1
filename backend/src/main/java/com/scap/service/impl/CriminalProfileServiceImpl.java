package com.scap.service.impl;

import com.scap.dto.CriminalProfileDto;
import com.scap.entity.CrimeRecord;
import com.scap.entity.CriminalProfile;
import com.scap.exception.ResourceNotFoundException;
import com.scap.repository.CriminalProfileRepository;
import com.scap.service.CriminalProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CriminalProfileServiceImpl implements CriminalProfileService {

    private final CriminalProfileRepository criminalProfileRepository;

    @Override
    public List<CriminalProfileDto> getAllCriminals() {
        return criminalProfileRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public CriminalProfileDto getCriminalById(String id) {
        CriminalProfile criminal = criminalProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CriminalProfile", "id", id));
        return mapToDto(criminal);
    }

    @Override
    public CriminalProfileDto createCriminal(CriminalProfileDto dto) {
        CriminalProfile criminal = CriminalProfile.builder()
                .codeName(dto.getCodeName())
                .legalName(dto.getLegalName())
                .aliases(dto.getAliases() != null ? dto.getAliases() : new ArrayList<>())
                .photoUrl(dto.getPhotoUrl())
                .dateOfBirth(dto.getDateOfBirth() != null ? LocalDate.parse(dto.getDateOfBirth()) : null)
                .gender(dto.getGender())
                .height(dto.getHeight())
                .build(dto.getBuild())
                .scarsOrTattoos(dto.getScarsOrTattoos() != null ? dto.getScarsOrTattoos() : new ArrayList<>())
                .threatLevel(dto.getThreatLevel() != null ? dto.getThreatLevel() : "MEDIUM")
                .modusOperandi(dto.getModusOperandi() != null ? dto.getModusOperandi() : new ArrayList<>())
                .pastConvictions(dto.getPastConvictions() != null ? dto.getPastConvictions() : new ArrayList<>())
                .knownAssociates(dto.getKnownAssociates() != null ? dto.getKnownAssociates() : new ArrayList<>())
                .status(dto.getStatus() != null ? dto.getStatus() : "WANTED")
                .build();

        CriminalProfile saved = criminalProfileRepository.save(criminal);
        return mapToDto(saved);
    }

    @Override
    public CriminalProfileDto updateCriminal(String id, CriminalProfileDto dto) {
        CriminalProfile criminal = criminalProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CriminalProfile", "id", id));

        criminal.setCodeName(dto.getCodeName());
        criminal.setLegalName(dto.getLegalName());
        if (dto.getThreatLevel() != null) criminal.setThreatLevel(dto.getThreatLevel());
        if (dto.getStatus() != null) criminal.setStatus(dto.getStatus());
        if (dto.getPhotoUrl() != null) criminal.setPhotoUrl(dto.getPhotoUrl());

        CriminalProfile updated = criminalProfileRepository.save(criminal);
        return mapToDto(updated);
    }

    @Override
    public List<CriminalProfileDto> searchCriminals(String query) {
        return criminalProfileRepository.searchCriminals(query).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private CriminalProfileDto mapToDto(CriminalProfile cp) {
        List<String> linkedCaseIds = cp.getLinkedCrimes().stream().map(CrimeRecord::getId).collect(Collectors.toList());

        return CriminalProfileDto.builder()
                .id(cp.getId())
                .codeName(cp.getCodeName())
                .legalName(cp.getLegalName())
                .aliases(cp.getAliases())
                .photoUrl(cp.getPhotoUrl())
                .dateOfBirth(cp.getDateOfBirth() != null ? cp.getDateOfBirth().toString() : null)
                .gender(cp.getGender())
                .height(cp.getHeight())
                .build(cp.getBuild())
                .scarsOrTattoos(cp.getScarsOrTattoos())
                .threatLevel(cp.getThreatLevel())
                .modusOperandi(cp.getModusOperandi())
                .pastConvictions(cp.getPastConvictions())
                .knownAssociates(cp.getKnownAssociates())
                .status(cp.getStatus())
                .linkedCaseIds(linkedCaseIds)
                .build();
    }
}
