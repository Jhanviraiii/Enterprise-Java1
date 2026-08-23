package com.smartcrime.portal.repository;

import com.smartcrime.portal.model.Victim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VictimRepository extends JpaRepository<Victim, String> {
    List<Victim> findByCaseId(String caseId);
}
