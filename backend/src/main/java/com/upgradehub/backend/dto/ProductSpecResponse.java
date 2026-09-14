package com.upgradehub.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ProductSpecResponse {

    private Long specId;
    private Long productId;
    private String productName;
    private String category;
    private String cpuSocket;
    private String memoryType;
    private Integer powerConsumption;
    private Integer recommendedPower;
    private Integer powerCapacity;
    private String gpuInterface;
    private String storageInterface;
    private Integer performanceScore;
    private Double benchmarkScore;
    private String benchmarkType;
    private String benchmarkSource;
    private LocalDate benchmarkUpdatedAt;
}