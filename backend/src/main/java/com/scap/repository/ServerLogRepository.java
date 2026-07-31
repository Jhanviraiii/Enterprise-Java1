package com.scap.repository;

import com.scap.entity.ServerLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServerLogRepository extends JpaRepository<ServerLog, String> {

    List<ServerLog> findBySourceIp(String sourceIp);

    List<ServerLog> findByThreatFlagNot(String threatFlag);
}
