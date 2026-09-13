package com.upgradehub.backend.controller;

import com.upgradehub.backend.dto.ProductRequest;
import com.upgradehub.backend.dto.ProductResponse;
import com.upgradehub.backend.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // 상품 전체 조회
    @GetMapping
    public List<ProductResponse> getProducts(
            @RequestParam(required = false)
            String keyword,

            @RequestParam(required = false)
            String category
    ) {

        return productService.getProducts(
                keyword,
                category
        );
    }

    // 상품 상세 조회
    @GetMapping("/{id:\\d+}")
    public ProductResponse getProduct(
            @PathVariable Long id
    ) {
        return productService.getProduct(id);
    }

    // 상품 등록
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductResponse createProduct(
            @Valid @RequestBody ProductRequest request
    ) {
        return productService.createProduct(request);
    }

    // 상품 수정
    @PutMapping("/{id:\\d+}")
    public ProductResponse updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request
    ) {
        return productService.updateProduct(id, request);
    }

    // 상품 삭제
    @DeleteMapping("/{id:\\d+}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(
            @PathVariable Long id
    ) {
        productService.deleteProduct(id);
    }
}