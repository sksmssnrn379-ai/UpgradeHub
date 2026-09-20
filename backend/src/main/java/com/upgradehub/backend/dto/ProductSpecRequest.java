package com.upgradehub.backend.dto;

import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import java.math.BigDecimal;

@Getter
@Setter
public class ProductSpecRequest {

    private String cpuSocket;

    private String memoryType;

    @Min(
            value = 0,
            message = "소비전력은 0W 이상이어야 합니다."
    )
    private Integer powerConsumption;

    @Min(
            value = 0,
            message = "권장 파워는 0W 이상이어야 합니다."
    )
    private Integer recommendedPower;

    @Min(
            value = 0,
            message = "파워 용량은 0W 이상이어야 합니다."
    )
    private Integer powerCapacity;

    private String gpuInterface;

    private String storageInterface;

    @DecimalMin(
        value = "0.0",
        message = "가로 길이는 0 이상이어야 합니다."
        )
        private BigDecimal widthMm;

        @DecimalMin(
                value = "0.0",
                message = "세로 길이는 0 이상이어야 합니다."
        )
        private BigDecimal depthMm;

        @DecimalMin(
                value = "0.0",
                message = "높이는 0 이상이어야 합니다."
        )
        private BigDecimal heightMm;

        @DecimalMin(
                value = "0.0",
                message = "무게는 0 이상이어야 합니다."
        )
        private BigDecimal weightG;

        @Min(
                value = 0,
                message = "기본 클럭은 0 이상이어야 합니다."
        )
        private Integer baseClockMhz;

        @Min(
                value = 0,
                message = "부스트 클럭은 0 이상이어야 합니다."
        )
        private Integer boostClockMhz;

        @Min(
                value = 0,
                message = "코어 수는 0 이상이어야 합니다."
        )
        private Integer coreCount;

        @Min(
                value = 0,
                message = "스레드 수는 0 이상이어야 합니다."
        )
        private Integer threadCount;

        
        
}