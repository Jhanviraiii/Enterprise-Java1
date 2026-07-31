package com.scap.repository;

import com.scap.entity.Witness;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WitnessRepository extends JpaRepository<Witness, String> {
    List<Witness> findByCrimeRecordId(String caseId);
}
