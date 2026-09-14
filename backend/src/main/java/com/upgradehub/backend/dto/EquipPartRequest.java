package com.upgradehub.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class EquipPartRequest {

    @NotNull(
            message = "상품 ID를 입력해 주세요."
    )
    private Long productId;
}