package com.scap.repository;

import com.scap.entity.FIR;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FirRepository extends JpaRepository<FIR, String> {

    Optional<FIR> findByFirNumber(String firNumber);

    List<FIR> findByStatus(String status);

    List<FIR> findByDistrictId(String districtId);

    @Query("SELECT f FROM FIR f WHERE " +
           "LOWER(f.firNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(f.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(f.complainantName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(f.districtName) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<FIR> searchFirs(@Param("query") String query);
}
