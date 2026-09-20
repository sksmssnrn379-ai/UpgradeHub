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
    public void recalculateAll() {
        List<Product> products =
                productRepository
                        .findAll();

        for (
                Product product :
                products
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
                products
        );

        Set<BenchmarkGroup> groups =
                products.stream()
                        .filter(
                                product ->
                                        product.getCategory()
                                                != null
                                                && product.getBenchmarkType()
                                                != null
                                                && !product.getBenchmarkType()
                                                .isBlank()
                                                && product.getBenchmarkScore()
                                                != null
                                                && product.getBenchmarkScore()
                                                > 0
                        )
                        .map(
                                product ->
                                        new BenchmarkGroup(
                                                product.getCategory()
                                                        .trim()
                                                        .toUpperCase(),
                                                product.getBenchmarkType()
                                                        .trim()
                                                        .toUpperCase()
                                        )
                        )
                        .collect(
                                Collectors.toSet()
                        );

        for (
                BenchmarkGroup group :
                groups
        ) {
            recalculateGroup(
                    group.category(),
                    group.benchmarkType()
            );
        }
    }

    private record BenchmarkGroup(
            String category,
            String benchmarkType
    ) {
    }
}