package com.scap.service;

import com.scap.dto.CrimeRecordDto;
import java.util.List;

public interface CrimeRecordService {
    List<CrimeRecordDto> getAllCrimeRecords();
    CrimeRecordDto getCrimeRecordById(String id);
    CrimeRecordDto getCrimeRecordByCaseNumber(String caseNumber);
    CrimeRecordDto createCrimeRecord(CrimeRecordDto crimeRecordDto);
    CrimeRecordDto updateCrimeStatus(String id, String status);
    List<CrimeRecordDto> searchCrimeRecords(String query);
}
