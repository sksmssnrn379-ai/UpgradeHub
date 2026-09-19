package com.upgradehub.backend.controller;

import com.upgradehub.backend.dto.AdminProductRequest;
import com.upgradehub.backend.dto.AdminProductResponse;
import com.upgradehub.backend.service.AdminProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final AdminProductService
            adminProductService;

    @GetMapping
    public ResponseEntity<
            List<AdminProductResponse>
    > getProducts() {

        return ResponseEntity.ok(
                adminProductService
                        .getProducts()
        );
    }

    @GetMapping("/{productId}")
    public ResponseEntity<
            AdminProductResponse
    > getProduct(
            @PathVariable Long productId
    ) {
        return ResponseEntity.ok(
                adminProductService
                        .getProduct(productId)
        );
    }

    @PostMapping
    public ResponseEntity<
            AdminProductResponse
    > createProduct(
            @Valid @RequestBody
            AdminProductRequest request
    ) {
        return ResponseEntity.ok(
                adminProductService
                        .createProduct(request)
        );
    }

    @PutMapping("/{productId}")
    public ResponseEntity<
            AdminProductResponse
    > updateProduct(
            @PathVariable Long productId,
            @Valid @RequestBody
            AdminProductRequest request
    ) {
        return ResponseEntity.ok(
                adminProductService
                        .updateProduct(
                                productId,
                                request
                        )
        );
    }

    @PutMapping("/{productId}/active")
    public ResponseEntity<
            AdminProductResponse
    > toggleActive(
            @PathVariable Long productId
    ) {
        return ResponseEntity.ok(
                adminProductService
                        .toggleActive(
                                productId
                        )
        );
    }
}