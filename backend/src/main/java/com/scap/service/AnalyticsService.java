package com.scap.service;

import com.scap.dto.HotspotDto;
import java.util.List;
import java.util.Map;

public interface AnalyticsService {
    List<HotspotDto> getAllHotspots();
    Map<String, Object> getDashboardStats();
}
