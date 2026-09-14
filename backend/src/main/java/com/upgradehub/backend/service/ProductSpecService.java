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

    private final ProductRepository productRepository;
    private final ProductSpecRepository productSpecRepository;

    public ProductSpecResponse createSpec(
            Long productId,
            ProductSpecRequest request
    ) {
        Product product = findProduct(productId);

        if (productSpecRepository
                .findByProductId(productId)
                .isPresent()) {

            throw new RuntimeException(
                    "이미 등록된 상품 사양이 있습니다."
            );
        }

        ProductSpec productSpec = ProductSpec.builder()
                .product(product)
                .cpuSocket(request.getCpuSocket())
                .memoryType(request.getMemoryType())
                .powerConsumption(
                        request.getPowerConsumption()
                )
                .recommendedPower(
                        request.getRecommendedPower()
                )
                .powerCapacity(
                        request.getPowerCapacity()
                )
                .gpuInterface(request.getGpuInterface())
                .storageInterface(
                        request.getStorageInterface()
                )
                .build();

        ProductSpec savedSpec =
                productSpecRepository.save(productSpec);

        return toResponse(savedSpec);
    }

    @Transactional(readOnly = true)
    public ProductSpecResponse getSpec(
            Long productId
    ) {
        ProductSpec productSpec =
                findProductSpec(productId);

        return toResponse(productSpec);
    }

    public ProductSpecResponse updateSpec(
            Long productId,
            ProductSpecRequest request
    ) {
        ProductSpec productSpec =
                findProductSpec(productId);

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

        ProductSpec updatedSpec =
                productSpecRepository.save(productSpec);

        return toResponse(updatedSpec);
    }

    private Product findProduct(
            Long productId
    ) {
        return productRepository.findById(productId)
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
                .findByProductId(productId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "상품 사양을 찾을 수 없습니다."
                        )
                );
    }

    private ProductSpecResponse toResponse(
            ProductSpec productSpec
    ) {
        Product product = productSpec.getProduct();

        return new ProductSpecResponse(
        productSpec.getId(),
        product.getId(),
        product.getName(),
        product.getCategory(),
        productSpec.getCpuSocket(),
        productSpec.getMemoryType(),
        productSpec.getPowerConsumption(),
        productSpec.getRecommendedPower(),
        productSpec.getPowerCapacity(),
        productSpec.getGpuInterface(),
        productSpec.getStorageInterface(),

        product.getPerformanceScore(),
        product.getBenchmarkScore(),
        product.getBenchmarkType(),
        product.getBenchmarkSource(),
        product.getBenchmarkUpdatedAt()
);
    }
}