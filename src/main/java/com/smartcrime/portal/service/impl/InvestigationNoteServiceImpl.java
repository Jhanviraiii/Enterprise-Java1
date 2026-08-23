package com.smartcrime.portal.service.impl;

import com.smartcrime.portal.exception.ResourceNotFoundException;
import com.smartcrime.portal.model.InvestigationNote;
import com.smartcrime.portal.repository.InvestigationNoteRepository;
import com.smartcrime.portal.service.InvestigationNoteService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@Transactional
public class InvestigationNoteServiceImpl implements InvestigationNoteService {

    private final InvestigationNoteRepository investigationNoteRepository;

    public InvestigationNoteServiceImpl(InvestigationNoteRepository investigationNoteRepository) {
        this.investigationNoteRepository = investigationNoteRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvestigationNote> getAllNotes() {
        return investigationNoteRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public InvestigationNote getNoteById(String id) {
        return investigationNoteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Investigation note not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvestigationNote> getNotesByCaseId(String caseId) {
        return investigationNoteRepository.findByCaseId(caseId);
    }

    @Override
    public InvestigationNote createNote(InvestigationNote note) {
        if (note.getTimestamp() == null || note.getTimestamp().trim().isEmpty()) {
            note.setTimestamp(Instant.now().toString());
        }
        return investigationNoteRepository.save(note);
    }

    @Override
    public InvestigationNote updateNote(String id, InvestigationNote updated) {
        InvestigationNote existing = getNoteById(id);
        if (updated.getAuthorName() != null) existing.setAuthorName(updated.getAuthorName());
        if (updated.getAuthorRole() != null) existing.setAuthorRole(updated.getAuthorRole());
        if (updated.getContent() != null) existing.setContent(updated.getContent());
        if (updated.getCategory() != null) existing.setCategory(updated.getCategory());

        return investigationNoteRepository.save(existing);
    }

    @Override
    public void deleteNote(String id) {
        if (!investigationNoteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Investigation note not found with id: " + id);
        }
        investigationNoteRepository.deleteById(id);
    }
}
