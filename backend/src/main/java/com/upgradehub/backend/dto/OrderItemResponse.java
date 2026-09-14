package com.upgradehub.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class OrderItemResponse {

    private Long productId;
    private Long productId;
    private String productName;
    private String brand;
    private Long orderPrice;
    private Integer quantity;
    private Long subtotal;
}