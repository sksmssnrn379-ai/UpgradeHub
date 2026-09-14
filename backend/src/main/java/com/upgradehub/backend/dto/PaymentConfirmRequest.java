package com.upgradehub.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PaymentConfirmRequest {

    @NotBlank(
            message = "결제 키가 필요합니다."
    )
    private String paymentKey;

    @NotBlank(
            message = "결제 주문번호가 필요합니다."
    )
    private String orderId;

    @NotNull(
            message = "결제 금액이 필요합니다."
    )
    private Long amount;
}