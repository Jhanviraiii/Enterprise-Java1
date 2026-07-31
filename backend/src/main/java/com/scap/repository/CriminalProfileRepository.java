package com.scap.repository;

import com.scap.entity.CriminalProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CriminalProfileRepository extends JpaRepository<CriminalProfile, String> {

    List<CriminalProfile> findByStatus(String status);

    List<CriminalProfile> findByThreatLevel(String threatLevel);

    @Query("SELECT cp FROM CriminalProfile cp WHERE " +
           "LOWER(cp.legalName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(cp.codeName) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<CriminalProfile> searchCriminals(@Param("query") String query);
}
