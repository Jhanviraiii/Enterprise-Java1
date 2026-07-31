package com.scap.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatternMatchStatsDto {
    private long totalMatches;
    private long activeMatches;
    private long confirmedMatches;
    private long dismissedMatches;
}
