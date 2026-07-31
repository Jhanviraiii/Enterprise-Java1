package com.scap.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HotspotDto {

    private String id;
    private String name;
    private String code;
    private String riskLevel;
    private Integer totalIncidents;
    private String primaryCrimeType;
    private Coordinates crimeCoordinates;
    private Integer activePatrolUnits;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Coordinates {
        private Double x;
        private Double y;
    }
}
