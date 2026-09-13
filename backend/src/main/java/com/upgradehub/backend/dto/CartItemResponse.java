package com.upgradehub.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CartItemResponse {

    private Long itemId;
    private Long productId;
    private String productName;
    private String brand;
    private Long price;
    private Integer quantity;
    private Long subtotal;
}