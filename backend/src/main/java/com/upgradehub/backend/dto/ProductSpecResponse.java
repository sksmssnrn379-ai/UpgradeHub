package com.upgradehub.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDate;
import java.math.BigDecimal;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
@Getter
@Builder
@NoArgsConstructor
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
    private BigDecimal widthMm;

    private BigDecimal depthMm;

    private BigDecimal heightMm;

    private BigDecimal weightG;

    private Integer baseClockMhz;

    private Integer boostClockMhz;

    private Integer coreCount;

    private Integer threadCount;
}