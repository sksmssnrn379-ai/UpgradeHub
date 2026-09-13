package com.upgradehub.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class AiRecommendationResponse {

    private Long targetProductId;
    private String currentProductName;
    private String targetProductName;
    private Double performanceGainPercent;
    private Long targetPrice;
    private Long budget;
    private Boolean withinBudget;
    private Boolean compatible;
    private List<String> compatibilityWarnings;
    private String recommendation;
    private String reason;
}