package com.upgradehub.backend.service;

import com.upgradehub.backend.dto.AdminProductRequest;
import com.upgradehub.backend.dto.AdminProductResponse;
import com.upgradehub.backend.entity.Product;
import com.upgradehub.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminProductService {

    private final ProductRepository
            productRepository;

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
        Product product = Product.builder()
                .name(request.getName())
                .brand(request.getBrand())
                .category(
                        request.getCategory()
                                .trim()
                                .toUpperCase()
                )
                .price(request.getPrice())
                .stock(request.getStock())
                .performanceScore(
                        request.getPerformanceScore()
                )
                .imageUrl(request.getImageUrl())
                .active(true)
                .build();

        return toResponse(
                productRepository.save(product)
        );
    }

    public AdminProductResponse updateProduct(
            Long productId,
            AdminProductRequest request
    ) {
        Product product =
                findProduct(productId);

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

        product.setPerformanceScore(
                request.getPerformanceScore()
        );

        product.setImageUrl(
                request.getImageUrl()
        );

        return toResponse(
                productRepository.save(product)
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

        return toResponse(
                productRepository.save(product)
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

    private AdminProductResponse toResponse(
        Product product
) {
    return AdminProductResponse
            .builder()
            .id(product.getId())
            .name(product.getName())
            .brand(product.getBrand())
            .category(product.getCategory())
            .price(product.getPrice())
            .stock(product.getStock())
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
            .active(product.getActive())
            .build();
}
}