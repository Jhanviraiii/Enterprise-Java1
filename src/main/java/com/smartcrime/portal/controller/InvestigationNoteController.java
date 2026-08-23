package com.smartcrime.portal.controller;

import com.smartcrime.portal.dto.ApiResponse;
import com.smartcrime.portal.model.InvestigationNote;
import com.smartcrime.portal.service.InvestigationNoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notes")
public class InvestigationNoteController {

    private final InvestigationNoteService investigationNoteService;

    public InvestigationNoteController(InvestigationNoteService investigationNoteService) {
        this.investigationNoteService = investigationNoteService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<InvestigationNote>>> getAllNotes() {
        return ResponseEntity.ok(ApiResponse.success("Investigation notes retrieved", investigationNoteService.getAllNotes()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InvestigationNote>> getNoteById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success("Investigation note retrieved", investigationNoteService.getNoteById(id)));
    }

    @GetMapping("/case/{caseId}")
    public ResponseEntity<ApiResponse<List<InvestigationNote>>> getNotesByCaseId(@PathVariable String caseId) {
        return ResponseEntity.ok(ApiResponse.success("Case investigation notes retrieved", investigationNoteService.getNotesByCaseId(caseId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<InvestigationNote>> createNote(@RequestBody InvestigationNote note) {
        InvestigationNote created = investigationNoteService.createNote(note);
        return ResponseEntity.status(201).body(ApiResponse.success("Investigation note added", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<InvestigationNote>> updateNote(@PathVariable String id, @RequestBody InvestigationNote note) {
        InvestigationNote updated = investigationNoteService.updateNote(id, note);
        return ResponseEntity.ok(ApiResponse.success("Investigation note updated", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNote(@PathVariable String id) {
        investigationNoteService.deleteNote(id);
        return ResponseEntity.ok(ApiResponse.success("Investigation note deleted", null));
    }
}
