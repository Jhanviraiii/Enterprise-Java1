package com.scap.service;

import com.scap.entity.IPAddress;
import com.scap.entity.ServerLog;
import com.scap.entity.ThreatDetection;

import java.util.List;

public interface IntelService {
    IPAddress traceIp(String ipString);
    List<ServerLog> getAllServerLogs();
    List<ThreatDetection> getThreatDetections();
    ServerLog analyzePayload(String sourceIp, String payload);
}
