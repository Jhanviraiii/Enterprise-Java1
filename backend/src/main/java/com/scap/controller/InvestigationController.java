package com.scap.controller;

import com.scap.dto.InvestigationNoteDto;
import com.scap.service.InvestigationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/investigations")
@RequiredArgsConstructor
public class InvestigationController {

    private final InvestigationService investigationService;

    @GetMapping("/notes/case/{caseId}")
    public ResponseEntity<List<InvestigationNoteDto>> getNotesByCaseId(@PathVariable String caseId) {
        return ResponseEntity.ok(investigationService.getNotesByCaseId(caseId));
    }

    @PostMapping("/notes")
    public ResponseEntity<InvestigationNoteDto> addNote(
            @Valid @RequestBody InvestigationNoteDto noteDto,
            @RequestParam(required = false, defaultValue = "Det. Raymond Cooper") String authorName,
            @RequestParam(required = false, defaultValue = "INVESTIGATOR") String authorRole) {
        return new ResponseEntity<>(investigationService.addNote(noteDto, authorName, authorRole), HttpStatus.CREATED);
    }
}
