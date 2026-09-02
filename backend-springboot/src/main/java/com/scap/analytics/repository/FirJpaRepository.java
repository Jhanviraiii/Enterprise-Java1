package com.scap.analytics.repository;

import com.scap.analytics.model.FirEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FirJpaRepository extends JpaRepository<FirEntity, String> {
    Optional<FirEntity> findByFirNumber(String firNumber);
}
