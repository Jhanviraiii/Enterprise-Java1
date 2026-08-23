package com.smartcrime.portal.repository;

import com.smartcrime.portal.model.Witness;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WitnessRepository extends JpaRepository<Witness, String> {
    List<Witness> findByCaseId(String caseId);
}
