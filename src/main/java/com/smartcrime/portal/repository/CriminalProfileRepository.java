package com.smartcrime.portal.repository;

import com.smartcrime.portal.model.CriminalProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CriminalProfileRepository extends JpaRepository<CriminalProfile, String> {
    List<CriminalProfile> findByThreatLevel(String threatLevel);
    List<CriminalProfile> findByStatus(String status);
}
