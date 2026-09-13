package com.upgradehub.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class CompareResponse {

    private String current;
    private String target;
    private double performanceGainPercent;
    private long priceDiff;
    private String recommendation;
}