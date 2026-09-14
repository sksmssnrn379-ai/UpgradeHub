package com.upgradehub.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentPrepareResponse {

    private Long orderId;

    private String paymentOrderId;

    private Long amount;

    private String orderName;

    private String customerName;

    private String customerEmail;
}