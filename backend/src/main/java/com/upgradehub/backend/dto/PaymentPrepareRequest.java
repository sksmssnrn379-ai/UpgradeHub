package com.upgradehub.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PaymentPrepareRequest {

    @NotNull(
            message = "배송지를 선택해 주세요."
    )
    private Long addressId;
}