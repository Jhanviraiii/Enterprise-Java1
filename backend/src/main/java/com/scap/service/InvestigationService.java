package com.scap.service;

import com.scap.dto.InvestigationNoteDto;
import java.util.List;

public interface InvestigationService {
    List<InvestigationNoteDto> getNotesByCaseId(String caseId);
    InvestigationNoteDto addNote(InvestigationNoteDto noteDto, String authorName, String authorRole);
}
