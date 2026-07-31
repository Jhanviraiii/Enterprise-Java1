package com.scap.service.impl;

import com.scap.dto.InvestigationNoteDto;
import com.scap.entity.CrimeRecord;
import com.scap.entity.InvestigationTimeline;
import com.scap.exception.ResourceNotFoundException;
import com.scap.repository.CrimeRecordRepository;
import com.scap.repository.InvestigationTimelineRepository;
import com.scap.service.InvestigationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvestigationServiceImpl implements InvestigationService {

    private final InvestigationTimelineRepository timelineRepository;
    private final CrimeRecordRepository crimeRecordRepository;

    @Override
    public List<InvestigationNoteDto> getNotesByCaseId(String caseId) {
        return timelineRepository.findByCrimeRecordIdOrderByTimestampDesc(caseId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public InvestigationNoteDto addNote(InvestigationNoteDto dto, String authorName, String authorRole) {
        CrimeRecord crimeRecord = crimeRecordRepository.findById(dto.getCaseId())
                .orElseThrow(() -> new ResourceNotFoundException("CrimeRecord", "id", dto.getCaseId()));

        InvestigationTimeline note = InvestigationTimeline.builder()
                .crimeRecord(crimeRecord)
                .timestamp(LocalDateTime.now())
                .authorName(authorName != null ? authorName : "Det. Raymond Cooper")
                .authorRole(authorRole != null ? authorRole : "INVESTIGATOR")
                .content(dto.getContent())
                .category(dto.getCategory() != null ? dto.getCategory() : "LEAD")
                .build();

        InvestigationTimeline saved = timelineRepository.save(note);
        return mapToDto(saved);
    }

    private InvestigationNoteDto mapToDto(InvestigationTimeline t) {
        return InvestigationNoteDto.builder()
                .id(t.getId())
                .caseId(t.getCrimeRecord() != null ? t.getCrimeRecord().getId() : null)
                .timestamp(t.getTimestamp().toString())
                .authorName(t.getAuthorName())
                .authorRole(t.getAuthorRole())
                .content(t.getContent())
                .category(t.getCategory())
                .build();
    }
}
