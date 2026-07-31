package com.scap.service.impl;

import com.scap.dto.VictimDto;
import com.scap.dto.WitnessDto;
import com.scap.entity.CrimeRecord;
import com.scap.entity.Victim;
import com.scap.entity.Witness;
import com.scap.exception.ResourceNotFoundException;
import com.scap.repository.CrimeRecordRepository;
import com.scap.repository.VictimRepository;
import com.scap.repository.WitnessRepository;
import com.scap.service.PeopleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PeopleServiceImpl implements PeopleService {

    private final VictimRepository victimRepository;
    private final WitnessRepository witnessRepository;
    private final CrimeRecordRepository crimeRecordRepository;

    @Override
    public List<VictimDto> getVictimsByCase(String caseId) {
        return victimRepository.findByCrimeRecordId(caseId).stream()
                .map(this::mapVictimToDto)
                .collect(Collectors.toList());
    }

    @Override
    public VictimDto addVictim(VictimDto dto) {
        CrimeRecord crimeRecord = crimeRecordRepository.findById(dto.getCaseId())
                .orElseThrow(() -> new ResourceNotFoundException("CrimeRecord", "id", dto.getCaseId()));

        Victim victim = Victim.builder()
                .crimeRecord(crimeRecord)
                .name(dto.getName())
                .age(dto.getAge())
                .contactNumber(dto.getContactNumber())
                .address(dto.getAddress())
                .statement(dto.getStatement())
                .protectionStatus(dto.getProtectionStatus() != null ? dto.getProtectionStatus() : "NONE")
                .isConfidential(dto.getIsConfidential() != null ? dto.getIsConfidential() : false)
                .build();

        Victim saved = victimRepository.save(victim);
        return mapVictimToDto(saved);
    }

    @Override
    public List<WitnessDto> getWitnessesByCase(String caseId) {
        return witnessRepository.findByCrimeRecordId(caseId).stream()
                .map(this::mapWitnessToDto)
                .collect(Collectors.toList());
    }

    @Override
    public WitnessDto addWitness(WitnessDto dto) {
        CrimeRecord crimeRecord = crimeRecordRepository.findById(dto.getCaseId())
                .orElseThrow(() -> new ResourceNotFoundException("CrimeRecord", "id", dto.getCaseId()));

        Witness witness = Witness.builder()
                .crimeRecord(crimeRecord)
                .name(dto.getName())
                .contactNumber(dto.getContactNumber())
                .statement(dto.getStatement())
                .credibilityRating(dto.getCredibilityRating() != null ? dto.getCredibilityRating() : "MODERATE")
                .isProtected(dto.getIsProtected() != null ? dto.getIsProtected() : false)
                .depositionDate(dto.getDepositionDate() != null ? LocalDateTime.parse(dto.getDepositionDate()) : null)
                .build();

        Witness saved = witnessRepository.save(witness);
        return mapWitnessToDto(saved);
    }

    private VictimDto mapVictimToDto(Victim v) {
        return VictimDto.builder()
                .id(v.getId())
                .caseId(v.getCrimeRecord() != null ? v.getCrimeRecord().getId() : null)
                .name(v.getName())
                .age(v.getAge())
                .contactNumber(v.getContactNumber())
                .address(v.getAddress())
                .statement(v.getStatement())
                .protectionStatus(v.getProtectionStatus())
                .isConfidential(v.getIsConfidential())
                .build();
    }

    private WitnessDto mapWitnessToDto(Witness w) {
        return WitnessDto.builder()
                .id(w.getId())
                .caseId(w.getCrimeRecord() != null ? w.getCrimeRecord().getId() : null)
                .name(w.getName())
                .contactNumber(w.getContactNumber())
                .statement(w.getStatement())
                .credibilityRating(w.getCredibilityRating())
                .isProtected(w.getIsProtected())
                .depositionDate(w.getDepositionDate() != null ? w.getDepositionDate().toString() : null)
                .build();
    }
}
