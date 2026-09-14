
package com.upgradehub.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class ProductRequest {

    @NotBlank(message = "상품명을 입력해 주세요.")
    private String name;

    @NotBlank(message = "제조사를 입력해 주세요.")
    private String brand;

    @NotNull(message = "가격을 입력해 주세요.")
    @Min(value = 0, message = "가격은 0원 이상이어야 합니다.")
    private Long price;

    @NotNull(message = "재고를 입력해 주세요.")
    @Min(value = 0, message = "재고는 0개 이상이어야 합니다.")
    private Integer stock;

    @NotBlank(message = "카테고리를 입력해 주세요.")
    private String category;

    @NotNull(message = "성능 점수를 입력해 주세요.")
    @Min(value = 1, message = "성능 점수는 1 이상이어야 합니다.")
    private Integer performanceScore;

    private Double benchmarkScore;
    private String benchmarkType;
    private String benchmarkSource;
    private LocalDate benchmarkUpdatedAt;
}