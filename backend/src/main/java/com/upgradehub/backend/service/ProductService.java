package com.upgradehub.backend.service;

import com.upgradehub.backend.dto.ProductRequest;
import com.upgradehub.backend.dto.ProductResponse;
import com.upgradehub.backend.entity.Product;
import com.upgradehub.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final PerformanceScoreService
        performanceScoreService;    
    // 전체 상품 조회
    public List<ProductResponse> getProducts(
        String keyword,
        String category
        ) {

        boolean hasKeyword =
                keyword != null
                        && !keyword.isBlank();

        boolean hasCategory =
                category != null
                        && !category.isBlank();

        List<Product> products;

        if (hasKeyword && hasCategory) {

                products = productRepository
                        .findByNameContainingIgnoreCaseAndCategoryIgnoreCase(
                                keyword.trim(),
                                category.trim()
                        );

        } else if (hasKeyword) {

                products = productRepository
                        .findByNameContainingIgnoreCase(
                                keyword.trim()
                        );

        } else if (hasCategory) {

                products = productRepository
                        .findByCategoryIgnoreCase(
                                category.trim()
                        );

        } else {

                products = productRepository.findAll();
        }

        return products.stream()
                .map(this::toResponse)
                .toList();
        }

    // 상품 상세 조회
    public ProductResponse getProduct(Long id) {

        Product product = findProduct(id);

        return toResponse(product);
    }

    // 상품 등록
    public ProductResponse createProduct(
        ProductRequest request
        ) {
        Product product = Product.builder()
                .name(request.getName())
                .brand(request.getBrand())
                .price(request.getPrice())
                .stock(request.getStock())
                .category(
                        request.getCategory()
                                .trim()
                                .toUpperCase()
                )
                .benchmarkScore(
                        request.getBenchmarkScore()
                )
                .benchmarkType(
                        request.getBenchmarkType()
                )
                .benchmarkSource(
                        request.getBenchmarkSource()
                )
                .benchmarkUpdatedAt(
                        request.getBenchmarkUpdatedAt()
                )
                .build();

        Product savedProduct =
                productRepository.save(product);

        performanceScoreService
                .recalculateCategory(
                        savedProduct.getCategory()
                );

        Product recalculatedProduct =
                productRepository
                        .findById(savedProduct.getId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "상품을 찾을 수 없습니다."
                                )
                        );

        return toResponse(
                recalculatedProduct
        );
        }
        

    // 상품 삭제
    public void deleteProduct(Long id) {

        Product product = findProduct(id);

        productRepository.delete(product);
    }

    // 상품 ID로 엔티티 조회
    private Product findProduct(Long id) {

        return productRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "상품을 찾을 수 없습니다."
                        )
                );
    }

    // Product 엔티티를 ProductResponse DTO로 변환
    private ProductResponse toResponse(
        Product product
        ) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .brand(product.getBrand())
                .price(product.getPrice())
                .stock(product.getStock())
                .category(product.getCategory())
                
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
        public ProductResponse updateProduct(
        Long id,
        ProductRequest request
        ) {
        Product product = findProduct(id);

        product.setName(request.getName());
        product.setBrand(request.getBrand());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setCategory(
                request.getCategory()
                        .trim()
                        .toUpperCase()
        );

        product.setBenchmarkScore(
                request.getBenchmarkScore()
        );
        product.setBenchmarkType(
                request.getBenchmarkType()
        );
        product.setBenchmarkSource(
                request.getBenchmarkSource()
        );
        product.setBenchmarkUpdatedAt(
                request.getBenchmarkUpdatedAt()
        );

        Product savedProduct =
                productRepository.save(product);

        performanceScoreService.recalculateCategory(
                savedProduct.getCategory()
        );

        return toResponse(savedProduct);
        }       
}