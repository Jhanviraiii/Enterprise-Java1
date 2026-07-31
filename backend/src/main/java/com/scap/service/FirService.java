package com.scap.service;

import com.scap.dto.FirDto;
import java.util.List;

public interface FirService {
    List<FirDto> getAllFirs();
    FirDto getFirById(String id);
    FirDto getFirByNumber(String firNumber);
    FirDto createFir(FirDto firDto, String reportingUserBadge);
    FirDto updateFirStatus(String id, String status, String note, String updatedBy);
    List<FirDto> searchFirs(String query);
}
