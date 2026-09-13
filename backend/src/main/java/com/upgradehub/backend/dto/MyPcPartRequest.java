package com.upgradehub.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MyPcPartRequest {

    @NotNull(message = "주문 상품 ID를 입력해 주세요.")
    private Long orderItemId;
}