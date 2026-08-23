package com.smartcrime.portal.repository;

import com.smartcrime.portal.model.PatternAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatternAlertRepository extends JpaRepository<PatternAlert, String> {
    List<PatternAlert> findByStatus(String status);
}
