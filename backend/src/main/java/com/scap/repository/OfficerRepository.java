package com.scap.repository;

import com.scap.entity.Officer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OfficerRepository extends JpaRepository<Officer, String> {

    Optional<Officer> findByBadgeNumber(String badgeNumber);

    List<Officer> findByRole(String role);

    @Query("SELECT o FROM Officer o WHERE " +
           "LOWER(o.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(o.badgeNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(o.rankDesignation) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Officer> searchOfficers(@Param("query") String query);
}
