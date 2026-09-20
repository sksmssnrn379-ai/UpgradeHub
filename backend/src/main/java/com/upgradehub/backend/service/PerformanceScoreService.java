package com.upgradehub.backend.service;

import com.upgradehub.backend.entity.Product;
import com.upgradehub.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PerformanceScoreService {

    private final ProductRepository
            productRepository;

    public int calculateNormalizedScore(
            double benchmarkScore,
            double maxBenchmarkScore
    ) {
        if (
                benchmarkScore <= 0
                        || maxBenchmarkScore <= 0
        ) {
            return 0;
        }

        double normalized =
                benchmarkScore
                        / maxBenchmarkScore
                        * 100.0;

        int roundedScore =
                (int) Math.round(
                        normalized
                );

        return Math.max(
                1,
                Math.min(
                        100,
                        roundedScore
                )
        );
    }

    @Transactional
    public void recalculateGroup(
            String category,
            String benchmarkType
    ) {
        List<Product> products =
                productRepository
                        .findByCategoryIgnoreCaseAndBenchmarkTypeIgnoreCase(
                                category,
                                benchmarkType
                        );

        double maxBenchmarkScore =
                products.stream()
                        .map(
                                Product::getBenchmarkScore
                        )
                        .filter(
                                score ->
                                        score != null
                                                && score > 0
                        )
                        .mapToDouble(
                                Double::doubleValue
                        )
                        .max()
                        .orElse(0.0);

        for (
                Product product :
                products
        ) {
            Double benchmarkScore =
                    product.getBenchmarkScore();

            if (
                    benchmarkScore == null
                            || benchmarkScore <= 0
                            || maxBenchmarkScore <= 0
            ) {
                product.setPerformanceScore(
                        null
                );

                continue;
            }

            int performanceScore =
                    calculateNormalizedScore(
                            benchmarkScore,
                            maxBenchmarkScore
                    );

            product.setPerformanceScore(
                    performanceScore
            );
        }

        productRepository.saveAll(
                products
        );
    }

    @Transactional
    public void recalculateCategory(
            String category
    ) {
        List<Product> categoryProducts =
                productRepository
                        .findByCategoryIgnoreCase(
                                category
                        );

        for (
                Product product :
                categoryProducts
        ) {
            if (
                    product.getBenchmarkScore()
                            == null
                            || product.getBenchmarkScore()
                            <= 0
                            || product.getBenchmarkType()
                            == null
                            || product.getBenchmarkType()
                            .isBlank()
            ) {
                product.setPerformanceScore(
                        null
                );
            }
        }

        productRepository.saveAll(
                categoryProducts
        );

        Set<String> benchmarkTypes =
                categoryProducts.stream()
                        .map(
                                Product::getBenchmarkType
                        )
                        .filter(
                                benchmarkType ->
                                        benchmarkType
                                                != null
                                                && !benchmarkType
                                                .isBlank()
                        )
                        .map(
                                benchmarkType ->
                                        benchmarkType
                                                .trim()
                                                .toUpperCase()
                        )
                        .collect(
                                Collectors.toSet()
                        );

        for (
                String benchmarkType :
                benchmarkTypes
        ) {
            recalculateGroup(
                    category,
                    benchmarkType
            );
        }
    }

    @Transactional
    public void recalculateAll() {
        recalculateCategory(
                "CPU"
        );

        recalculateCategory(
                "GPU"
        );

        recalculateCategory(
                "RAM"
        );

        recalculateCategory(
                "SSD"
        );

        recalculateCategory(
                "MOTHERBOARD"
        );

        recalculateCategory(
                "POWER"
        );
    }
}