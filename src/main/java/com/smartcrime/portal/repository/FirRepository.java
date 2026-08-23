package com.smartcrime.portal.repository;

import com.smartcrime.portal.model.FIR;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FirRepository extends JpaRepository<FIR, String> {
    Optional<FIR> findByFirNumber(String firNumber);
    List<FIR> findByDistrict(String district);
    List<FIR> findByStatus(String status);
}
