package com.upgradehub.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDate;
@Getter
@AllArgsConstructor
public class ProductResponse {

    private Long id;
    private String name;
    private String brand;
    private Long price;
    private Integer stock;
    private String category;
    private Integer performanceScore;
    private Double benchmarkScore;
    private String benchmarkType;
    private String benchmarkSource;
    private LocalDate benchmarkUpdatedAt;
}