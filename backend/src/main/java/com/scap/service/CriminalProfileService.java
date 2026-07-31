package com.scap.service;

import com.scap.dto.CriminalProfileDto;
import java.util.List;

public interface CriminalProfileService {
    List<CriminalProfileDto> getAllCriminals();
    CriminalProfileDto getCriminalById(String id);
    CriminalProfileDto createCriminal(CriminalProfileDto dto);
    CriminalProfileDto updateCriminal(String id, CriminalProfileDto dto);
    List<CriminalProfileDto> searchCriminals(String query);
}
