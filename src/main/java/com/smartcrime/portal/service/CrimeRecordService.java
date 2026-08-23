package com.smartcrime.portal.service;

import com.smartcrime.portal.model.CrimeRecord;

import java.util.List;

public interface CrimeRecordService {
    List<CrimeRecord> getAllCrimeRecords();
    CrimeRecord getCrimeRecordById(String id);
    CrimeRecord getCrimeRecordByCaseNumber(String caseNumber);
    CrimeRecord createCrimeRecord(CrimeRecord crimeRecord);
    CrimeRecord updateCrimeRecord(String id, CrimeRecord crimeRecord);
}
