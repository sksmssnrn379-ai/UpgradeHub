package com.upgradehub.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;

@Getter
@Setter
public class AiRecommendationRequest {
    @NotBlank(
        message = "추천 카테고리가 필요합니다."
    )
    private String category;
    @NotNull(message = "비교할 상품 ID를 입력해 주세요.")
    private Long targetProductId;

    @NotBlank(message = "사용 목적을 입력해 주세요.")
    private String purpose;

    @NotNull(message = "예산을 입력해 주세요.")
    @Min(
            value = 0,
            message = "예산은 0원 이상이어야 합니다."
    )
    private Long budget;
}