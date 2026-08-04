package com.scap.repository;

import com.scap.entity.InvestigationTimeline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvestigationTimelineRepository extends JpaRepository<InvestigationTimeline, String> {

    List<InvestigationTimeline> findByCrimeRecordIdOrderByTimestampDesc(String caseId);
}
