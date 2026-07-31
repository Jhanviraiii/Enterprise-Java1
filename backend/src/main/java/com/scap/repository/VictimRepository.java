package com.scap.repository;

import com.scap.entity.Victim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VictimRepository extends JpaRepository<Victim, String> {
    List<Victim> findByCrimeRecordId(String caseId);
}
