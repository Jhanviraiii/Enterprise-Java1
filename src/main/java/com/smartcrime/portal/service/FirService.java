package com.smartcrime.portal.service;

import com.smartcrime.portal.dto.FirDto;
import com.smartcrime.portal.model.FIR;

import java.util.List;

public interface FirService {
    List<FIR> getAllFirs();
    FIR getFirById(String id);
    FIR getFirByNumber(String firNumber);
    FIR createFir(FirDto firDto);
    FIR updateFirStatus(String id, String status, String note);
}
