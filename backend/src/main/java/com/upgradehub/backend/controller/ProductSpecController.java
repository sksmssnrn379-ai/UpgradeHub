package com.upgradehub.backend.controller;

import com.upgradehub.backend.dto.ProductSpecRequest;
import com.upgradehub.backend.dto.ProductSpecResponse;
import com.upgradehub.backend.service.ProductSpecService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductSpecController {

    private final ProductSpecService productSpecService;

    @PostMapping("/{productId}/spec")
    @ResponseStatus(HttpStatus.CREATED)
    public ProductSpecResponse createSpec(
            @PathVariable Long productId,
            @Valid @RequestBody ProductSpecRequest request
    ) {
        return productSpecService.createSpec(
                productId,
                request
        );
    }

    @GetMapping("/{productId}/spec")
    public ProductSpecResponse getSpec(
            @PathVariable Long productId
    ) {
        return productSpecService.getSpec(productId);
    }

    @PutMapping("/{productId}/spec")
    public ProductSpecResponse updateSpec(
            @PathVariable Long productId,
            @Valid @RequestBody ProductSpecRequest request
    ) {
        return productSpecService.updateSpec(
                productId,
                request
        );
    }
}