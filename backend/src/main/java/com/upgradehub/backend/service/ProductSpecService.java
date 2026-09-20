package com.upgradehub.backend.service;

import com.upgradehub.backend.dto.ProductSpecRequest;
import com.upgradehub.backend.dto.ProductSpecResponse;
import com.upgradehub.backend.entity.Product;
import com.upgradehub.backend.entity.ProductSpec;
import com.upgradehub.backend.repository.ProductRepository;
import com.upgradehub.backend.repository.ProductSpecRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductSpecService {

    private final ProductRepository
            productRepository;

    private final ProductSpecRepository
            productSpecRepository;

    public ProductSpecResponse createSpec(
            Long productId,
            ProductSpecRequest request
    ) {
        Product product =
                findProduct(productId);

        if (
                productSpecRepository
                        .findByProduct_Id(
                                productId
                        )
                        .isPresent()
        ) {
            throw new RuntimeException(
                    "이미 등록된 상품 사양이 있습니다."
            );
        }

        ProductSpec productSpec =
                ProductSpec.builder()
                        .product(product)
                        .cpuSocket(
                                request.getCpuSocket()
                        )
                        .memoryType(
                                request.getMemoryType()
                        )
                        .powerConsumption(
                                request.getPowerConsumption()
                        )
                        .recommendedPower(
                                request.getRecommendedPower()
                        )
                        .powerCapacity(
                                request.getPowerCapacity()
                        )
                        .gpuInterface(
                                request.getGpuInterface()
                        )
                        .storageInterface(
                                request.getStorageInterface()
                        )
                        .widthMm(
                                request.getWidthMm()
                        )
                        .depthMm(
                                request.getDepthMm()
                        )
                        .heightMm(
                                request.getHeightMm()
                        )
                        .weightG(
                                request.getWeightG()
                        )
                        .baseClockMhz(
                                request.getBaseClockMhz()
                        )
                        .boostClockMhz(
                                request.getBoostClockMhz()
                        )
                        .coreCount(
                                request.getCoreCount()
                        )
                        .threadCount(
                                request.getThreadCount()
                        )
                        .build();

        ProductSpec savedSpec =
                productSpecRepository.save(
                        productSpec
                );

        return toResponse(savedSpec);
    }

    @Transactional(readOnly = true)
    public ProductSpecResponse getSpec(
            Long productId
    ) {
        ProductSpec productSpec =
                findProductSpec(
                        productId
                );

        return toResponse(productSpec);
    }

    public ProductSpecResponse updateSpec(
            Long productId,
            ProductSpecRequest request
    ) {
        ProductSpec productSpec =
                findProductSpec(
                        productId
                );

        productSpec.setCpuSocket(
                request.getCpuSocket()
        );

        productSpec.setMemoryType(
                request.getMemoryType()
        );

        productSpec.setPowerConsumption(
                request.getPowerConsumption()
        );

        productSpec.setRecommendedPower(
                request.getRecommendedPower()
        );

        productSpec.setPowerCapacity(
                request.getPowerCapacity()
        );

        productSpec.setGpuInterface(
                request.getGpuInterface()
        );

        productSpec.setStorageInterface(
                request.getStorageInterface()
        );

        productSpec.setWidthMm(
                request.getWidthMm()
        );

        productSpec.setDepthMm(
                request.getDepthMm()
        );

        productSpec.setHeightMm(
                request.getHeightMm()
        );

        productSpec.setWeightG(
                request.getWeightG()
        );

        productSpec.setBaseClockMhz(
                request.getBaseClockMhz()
        );

        productSpec.setBoostClockMhz(
                request.getBoostClockMhz()
        );

        productSpec.setCoreCount(
                request.getCoreCount()
        );

        productSpec.setThreadCount(
                request.getThreadCount()
        );

        ProductSpec updatedSpec =
                productSpecRepository.save(
                        productSpec
                );

        return toResponse(updatedSpec);
    }

    private Product findProduct(
            Long productId
    ) {
        return productRepository
                .findById(productId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "상품을 찾을 수 없습니다."
                        )
                );
    }

    private ProductSpec findProductSpec(
            Long productId
    ) {
        return productSpecRepository
                .findByProduct_Id(
                        productId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "상품 사양을 찾을 수 없습니다."
                        )
                );
    }

    private ProductSpecResponse toResponse(
            ProductSpec productSpec
    ) {
        Product product =
                productSpec.getProduct();

        return ProductSpecResponse.builder()
                .specId(
        productSpec.getId()
)
                .productId(
                        product.getId()
                )
                .productName(
                        product.getName()
                )
                .category(
                        product.getCategory()
                )
                .cpuSocket(
                        productSpec.getCpuSocket()
                )
                .memoryType(
                        productSpec.getMemoryType()
                )
                .powerConsumption(
                        productSpec.getPowerConsumption()
                )
                .recommendedPower(
                        productSpec.getRecommendedPower()
                )
                .powerCapacity(
                        productSpec.getPowerCapacity()
                )
                .gpuInterface(
                        productSpec.getGpuInterface()
                )
                .storageInterface(
                        productSpec.getStorageInterface()
                )
                .widthMm(
                        productSpec.getWidthMm()
                )
                .depthMm(
                        productSpec.getDepthMm()
                )
                .heightMm(
                        productSpec.getHeightMm()
                )
                .weightG(
                        productSpec.getWeightG()
                )
                .baseClockMhz(
                        productSpec.getBaseClockMhz()
                )
                .boostClockMhz(
                        productSpec.getBoostClockMhz()
                )
                .coreCount(
                        productSpec.getCoreCount()
                )
                .threadCount(
                        productSpec.getThreadCount()
                )
                .performanceScore(
                        product.getPerformanceScore()
                )
                .benchmarkScore(
                        product.getBenchmarkScore()
                )
                .benchmarkType(
                        product.getBenchmarkType()
                )
                .benchmarkSource(
                        product.getBenchmarkSource()
                )
                .benchmarkUpdatedAt(
                        product.getBenchmarkUpdatedAt()
                )
                .build();
    }
}