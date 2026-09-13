package com.upgradehub.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
public class OrderResponse {

    private Long orderId;
    private String status;
    private Long totalPrice;
    private LocalDateTime orderedAt;
    private List<OrderItemResponse> items;
}