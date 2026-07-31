package com.scap.service.impl;

import com.scap.entity.IPAddress;
import com.scap.entity.ServerLog;
import com.scap.entity.ThreatDetection;
import com.scap.repository.IPAddressRepository;
import com.scap.repository.ServerLogRepository;
import com.scap.repository.ThreatDetectionRepository;
import com.scap.service.IntelService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IntelServiceImpl implements IntelService {

    private final IPAddressRepository ipAddressRepository;
    private final ServerLogRepository serverLogRepository;
    private final ThreatDetectionRepository threatDetectionRepository;

    @Override
    public IPAddress traceIp(String ipString) {
        return ipAddressRepository.findByIpString(ipString)
                .orElseGet(() -> ipAddressRepository.save(IPAddress.builder()
                        .ipString(ipString)
                        .isp("Cyber Telecom Gateway")
                        .organization("Darknet Proxy Node")
                        .country("Eastern Europe Transit")
                        .city("Bucharest Sector 2")
                        .riskScore(89)
                        .isTor(true)
                        .isVpn(true)
                        .threatLevel("HIGH")
                        .lastActivity(LocalDateTime.now())
                        .build()));
    }

    @Override
    public List<ServerLog> getAllServerLogs() {
        return serverLogRepository.findAll();
    }

    @Override
    public List<ThreatDetection> getThreatDetections() {
        return threatDetectionRepository.findAll();
    }

    @Override
    public ServerLog analyzePayload(String sourceIp, String payload) {
        String threatFlag = "NORMAL";
        if (payload != null && (payload.toUpperCase().contains("SELECT") || payload.contains("' OR '1'='1"))) {
            threatFlag = "SQL_INJECTION";
        } else if (payload != null && payload.toLowerCase().contains("<script>")) {
            threatFlag = "XSS";
        }

        ServerLog log = ServerLog.builder()
                .timestamp(LocalDateTime.now())
                .sourceIp(sourceIp)
                .requestMethod("POST")
                .requestUrl("/api/v1/intel/log-analysis")
                .httpStatus(200)
                .userAgent("Mozilla/5.0 SCAP-Agent/2.0")
                .payloadData(payload)
                .threatFlag(threatFlag)
                .build();

        ServerLog saved = serverLogRepository.save(log);

        if (!"NORMAL".equals(threatFlag)) {
            ThreatDetection threat = ThreatDetection.builder()
                    .serverLog(saved)
                    .sourceIp(sourceIp)
                    .threatType(threatFlag)
                    .severity("HIGH")
                    .payloadPattern(payload)
                    .detectedTimestamp(LocalDateTime.now())
                    .status("NEW")
                    .build();
            threatDetectionRepository.save(threat);
        }

        return saved;
    }
}
