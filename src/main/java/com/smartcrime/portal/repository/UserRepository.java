package com.smartcrime.portal.repository;

import com.smartcrime.portal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByBadgeNumber(String badgeNumber);
    Optional<User> findByEmail(String email);
}
