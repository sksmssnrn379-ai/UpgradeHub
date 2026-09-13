package com.upgradehub.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class PurchasedPartResponse {

    private Long orderId;
    private Long orderItemId;
    private Long productId;
    private String productName;
    private String brand;
    private String category;
    private Integer quantity;
    private Long orderPrice;
    private LocalDateTime orderedAt;
}