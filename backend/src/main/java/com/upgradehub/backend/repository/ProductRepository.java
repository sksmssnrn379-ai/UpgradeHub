package com.upgradehub.backend.repository;

import com.upgradehub.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;


public interface ProductRepository
        extends JpaRepository<Product, Long> {

    // 상품명 검색
    List<Product> findByNameContainingIgnoreCase(
            String keyword
    );

    // 카테고리 검색
    List<Product> findByCategoryIgnoreCase(
            String category
    );

    // 상품명과 카테고리 동시 검색
    List<Product>
    findByNameContainingIgnoreCaseAndCategoryIgnoreCase(
            String keyword,
            String category
    );
    @Query("""
    SELECT MAX(p.benchmarkScore)
    FROM Product p
    WHERE UPPER(p.category) = UPPER(:category)
    AND p.benchmarkScore IS NOT NULL
    """)
        Optional<Double> findMaxBenchmarkScoreByCategory(
                @Param("category") String category
        );
}