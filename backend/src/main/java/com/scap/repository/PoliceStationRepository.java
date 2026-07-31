package com.scap.repository;

import com.scap.entity.PoliceStation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PoliceStationRepository extends JpaRepository<PoliceStation, String> {
    Optional<PoliceStation> findByStationCode(String stationCode);
    List<PoliceStation> findByDistrictId(String districtId);
}
