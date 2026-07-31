package com.scap.repository;

import com.scap.entity.ThreatDetection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThreatDetectionRepository extends JpaRepository<ThreatDetection, String> {

    List<ThreatDetection> findBySeverity(String severity);

    List<ThreatDetection> findBySourceIp(String sourceIp);
}
