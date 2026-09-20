package com.upgradehub.backend.repository;

import com.upgradehub.backend.entity.ProductSpec;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductSpecRepository
        extends JpaRepository<ProductSpec, Long> {

    Optional<ProductSpec> findByProduct_Id(
            Long productId
    );
}