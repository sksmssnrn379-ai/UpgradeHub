package com.upgradehub.backend.service;

import com.upgradehub.backend.entity.Product;
import com.upgradehub.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PerformanceScoreService {

    private final ProductRepository productRepository;

    public int calculateNormalizedScore(
            double benchmarkScore,
            double maxBenchmarkScore
    ) {
        if (
                benchmarkScore <= 0 ||
                maxBenchmarkScore <= 0
        ) {
            return 0;
        }

        double normalized =
                benchmarkScore
                        / maxBenchmarkScore
                        * 100.0;

        int roundedScore =
                (int) Math.round(normalized);

        return Math.max(
                0,
                Math.min(100, roundedScore)
        );
    }

    @Transactional
    public void recalculateCategory(
            String category
    ) {
        List<Product> products =
                productRepository
                        .findByCategoryIgnoreCase(
                                category
                        );

        double maxBenchmarkScore =
                products.stream()
                        .map(Product::getBenchmarkScore)
                        .filter(score ->
                                score != null &&
                                score > 0
                        )
                        .mapToDouble(
                                Double::doubleValue
                        )
                        .max()
                        .orElse(0.0);

        for (Product product : products) {
            Double benchmarkScore =
                    product.getBenchmarkScore();

            if (
                    benchmarkScore == null ||
                    benchmarkScore <= 0 ||
                    maxBenchmarkScore <= 0
            ) {
                product.setPerformanceScore(null);
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

        productRepository.saveAll(products);
    }
    @Transactional
        public void recalculateAll() {
        recalculateCategory("CPU");
        recalculateCategory("GPU");
        recalculateCategory("RAM");
        recalculateCategory("SSD");
        recalculateCategory("MOTHERBOARD");
        recalculateCategory("POWER");
        }
}