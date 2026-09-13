package com.upgradehub.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class CompatibilityResponse {

    private Long targetProductId;
    private String targetProductName;
    private String category;
    private boolean compatible;
    private List<String> checks;
    private List<String> warnings;
}