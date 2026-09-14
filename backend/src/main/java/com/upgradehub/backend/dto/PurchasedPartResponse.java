package com.upgradehub.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Builder;

import java.time.LocalDateTime;
@Builder
@Getter
@AllArgsConstructor
public class PurchasedPartResponse {

    private Long orderId;
    private Long productId;
    private String productName;
    private String brand;
    private String category;
    private Integer quantity;
    private Long orderPrice;
    private LocalDateTime orderedAt;
    private Long purchasedPartId;
    private LocalDateTime purchasedAt;
    private String name;
    private Long price;
    private Integer performanceScore;
    private String imageUrl;
}