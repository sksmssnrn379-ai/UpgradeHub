package com.upgradehub.backend.service;

import com.upgradehub.backend.dto.AdminProductRequest;
import com.upgradehub.backend.dto.AdminProductResponse;
import com.upgradehub.backend.entity.Product;
import com.upgradehub.backend.repository.ProductRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminProductService {

    private final ProductRepository
            productRepository;

    private final PerformanceScoreService
            performanceScoreService;

    private final EntityManager
            entityManager;

    @Transactional(readOnly = true)
    public List<AdminProductResponse>
    getProducts() {

        return productRepository
                .findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AdminProductResponse getProduct(
            Long productId
    ) {
        Product product =
                findProduct(productId);

        return toResponse(product);
    }

    public AdminProductResponse createProduct(
            AdminProductRequest request
    ) {
        Product product =
                Product.builder()
                        .name(
                                request.getName()
                        )
                        .brand(
                                request.getBrand()
                        )
                        .category(
                                request.getCategory()
                                        .trim()
                                        .toUpperCase()
                        )
                        .price(
                                request.getPrice()
                        )
                        .stock(
                                request.getStock()
                        )
                        .imageUrl(
                                request.getImageUrl()
                        )
                        .benchmarkScore(
                                request.getBenchmarkScore()
                        )
                        .benchmarkType(
                                normalizeNullableText(
                                        request.getBenchmarkType()
                                )
                        )
                        .benchmarkSource(
                                normalizeNullableText(
                                        request.getBenchmarkSource()
                                )
                        )
                        .benchmarkUpdatedAt(
                                request.getBenchmarkUpdatedAt()
                        )
                        .active(true)
                        .build();

        Product savedProduct =
                productRepository
                        .saveAndFlush(product);

        boolean hasBenchmark =
                request.getBenchmarkScore() != null
                        && request.getBenchmarkType() != null
                        && !request.getBenchmarkType()
                                .isBlank();

        if (hasBenchmark) {
            performanceScoreService
                    .recalculateAll();
        }

        entityManager.clear();

        Product updatedProduct =
                findProduct(
                        savedProduct.getId()
                );

        return toResponse(
                updatedProduct
        );
    }

    public AdminProductResponse updateProduct(
            Long productId,
            AdminProductRequest request
    ) {
        Product product =
                findProduct(productId);

        Double previousBenchmarkScore =
                product.getBenchmarkScore();

        String previousBenchmarkType =
                product.getBenchmarkType();

        String normalizedBenchmarkType =
                normalizeNullableText(
                        request.getBenchmarkType()
                );

        product.setName(
                request.getName()
        );

        product.setBrand(
                request.getBrand()
        );

        product.setCategory(
                request.getCategory()
                        .trim()
                        .toUpperCase()
        );

        product.setPrice(
                request.getPrice()
        );

        product.setStock(
                request.getStock()
        );

        product.setImageUrl(
                request.getImageUrl()
        );

        product.setBenchmarkScore(
                request.getBenchmarkScore()
        );

        product.setBenchmarkType(
                normalizedBenchmarkType
        );

        product.setBenchmarkSource(
                normalizeNullableText(
                        request.getBenchmarkSource()
                )
        );

        product.setBenchmarkUpdatedAt(
                request.getBenchmarkUpdatedAt()
        );

        boolean benchmarkChanged =
                !Objects.equals(
                        previousBenchmarkScore,
                        request.getBenchmarkScore()
                )
                        || !Objects.equals(
                                previousBenchmarkType,
                                normalizedBenchmarkType
                        );

        productRepository.saveAndFlush(
                product
        );

        if (benchmarkChanged) {
            performanceScoreService
                    .recalculateAll();
        }

        entityManager.clear();

        Product updatedProduct =
                findProduct(productId);

        return toResponse(
                updatedProduct
        );
    }

    public AdminProductResponse toggleActive(
            Long productId
    ) {
        Product product =
                findProduct(productId);

        product.setActive(
                !Boolean.TRUE.equals(
                        product.getActive()
                )
        );

        Product savedProduct =
                productRepository.save(
                        product
                );

        return toResponse(
                savedProduct
        );
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

    private String normalizeNullableText(
            String value
    ) {
        if (
                value == null
                        || value.isBlank()
        ) {
            return null;
        }

        return value.trim();
    }

    private AdminProductResponse toResponse(
            Product product
    ) {
        return AdminProductResponse
                .builder()
                .id(
                        product.getId()
                )
                .name(
                        product.getName()
                )
                .brand(
                        product.getBrand()
                )
                .category(
                        product.getCategory()
                )
                .price(
                        product.getPrice()
                )
                .stock(
                        product.getStock()
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
                .imageUrl(
                        product.getImageUrl()
                )
                .active(
                        product.getActive()
                )
                .build();
    }
}