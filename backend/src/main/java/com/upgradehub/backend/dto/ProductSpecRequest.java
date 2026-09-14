package com.upgradehub.backend.dto;

import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

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
        
}