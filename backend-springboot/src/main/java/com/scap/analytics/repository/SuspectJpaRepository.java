package com.scap.analytics.repository;

import com.scap.analytics.model.SuspectEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SuspectJpaRepository extends JpaRepository<SuspectEntity, String> {
    List<SuspectEntity> findByRiskLevel(String riskLevel);
    List<SuspectEntity> findByStatus(String status);
}
