package com.scap.repository;

import com.scap.entity.District;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DistrictRepository extends JpaRepository<District, String> {
    Optional<District> findByName(String name);
}
