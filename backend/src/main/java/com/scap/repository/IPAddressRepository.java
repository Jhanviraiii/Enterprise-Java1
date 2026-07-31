package com.scap.repository;

import com.scap.entity.IPAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IPAddressRepository extends JpaRepository<IPAddress, String> {

    Optional<IPAddress> findByIpString(String ipString);
}
