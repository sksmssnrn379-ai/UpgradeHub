package com.upgradehub.backend.dto;

import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

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
    @Query("""
        SELECT MAX(p.benchmarkScore)
        FROM Product p
        WHERE UPPER(p.category) = UPPER(:category)
        AND p.benchmarkScore IS NOT NULL
        """)
        Optional<Double> findMaxBenchmarkScoreByCategory(
                @Param("category")
                String category
        );
}