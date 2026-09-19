package com.upgradehub.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminProductResponse {

    private Long id;
    private String name;
    private String brand;
    private String category;
    private Long price;
    private Integer stock;
    private Integer performanceScore;
    private String imageUrl;
    private Boolean active;
}