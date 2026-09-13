package com.upgradehub.backend.service;

import com.upgradehub.backend.dto.CompareResponse;
import com.upgradehub.backend.entity.MyPc;
import com.upgradehub.backend.entity.Product;
import com.upgradehub.backend.repository.MyPcRepository;
import com.upgradehub.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CompareService {

    private final ProductRepository productRepository;
    private final MyPcRepository myPcRepository;

    /*
     * 현재 상품 ID와 구매 예정 상품 ID를 직접 받아 비교
     */
    public Map<String, Object> compare(
            Long currentId,
            Long targetId
    ) {

        Product current = productRepository.findById(currentId)
                .orElseThrow(() ->
                        new RuntimeException("현재 상품을 찾을 수 없습니다.")
                );

        Product target = productRepository.findById(targetId)
                .orElseThrow(() ->
                        new RuntimeException("비교할 상품을 찾을 수 없습니다.")
                );

        validatePerformanceScore(current, target);

        int performanceDiff =
                target.getPerformanceScore()
                        - current.getPerformanceScore();

        long priceDiff =
                target.getPrice()
                        - current.getPrice();

        String recommendation =
                createScoreRecommendation(performanceDiff);

        Map<String, Object> result = new HashMap<>();

        result.put("current", current.getName());
        result.put("target", target.getName());
        result.put("performanceDiff", performanceDiff);
        result.put("priceDiff", priceDiff);
        result.put("recommendation", recommendation);

        return result;
    }

    /*
     * MY PC ID를 직접 받아 현재 GPU와 구매 예정 GPU 비교
     */
    public Map<String, Object> compareWithMyPc(
            Long myPcId,
            Long targetId
    ) {

        MyPc myPc = myPcRepository.findById(myPcId)
                .orElseThrow(() ->
                        new RuntimeException("MY PC를 찾을 수 없습니다.")
                );

        Product current = myPc.getGpu();

        if (current == null) {
            throw new RuntimeException(
                    "MY PC에 GPU가 등록되어 있지 않습니다."
            );
        }

        Product target = productRepository.findById(targetId)
                .orElseThrow(() ->
                        new RuntimeException("비교할 상품을 찾을 수 없습니다.")
                );

        validateGpuTarget(target);
        validatePerformanceScore(current, target);

        int performanceDiff =
                target.getPerformanceScore()
                        - current.getPerformanceScore();

        long priceDiff =
                target.getPrice()
                        - current.getPrice();

        String recommendation =
                createScoreRecommendation(performanceDiff);

        Map<String, Object> result = new HashMap<>();

        result.put("current", current.getName());
        result.put("target", target.getName());
        result.put("performanceDiff", performanceDiff);
        result.put("priceDiff", priceDiff);
        result.put("recommendation", recommendation);

        return result;
    }

    /*
     * JWT 로그인 사용자의 MY PC GPU와 구매 예정 GPU 비교
     * 이 메서드는 CompareResponse DTO를 반환
     */
    public CompareResponse compareLoginUser(
            String email,
            Long targetId
    ) {

        MyPc myPc = myPcRepository.findByUserEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("등록된 MY PC가 없습니다.")
                );

        Product current = myPc.getGpu();

        if (current == null) {
            throw new RuntimeException(
                    "MY PC에 GPU가 등록되어 있지 않습니다."
            );
        }

        Product target = productRepository.findById(targetId)
                .orElseThrow(() ->
                        new RuntimeException("비교할 상품을 찾을 수 없습니다.")
                );

        validateGpuTarget(target);
        validatePerformanceScore(current, target);

        int performanceDiff =
                target.getPerformanceScore()
                        - current.getPerformanceScore();

        double performanceGainPercent =
                ((double) performanceDiff
                        / current.getPerformanceScore()) * 100;

        double roundedGainPercent =
                Math.round(performanceGainPercent * 10) / 10.0;

        long priceDiff =
                target.getPrice()
                        - current.getPrice();

        String recommendation =
                createPercentRecommendation(
                        performanceGainPercent
                );

        return CompareResponse.builder()
                .current(current.getName())
                .target(target.getName())
                .performanceGainPercent(roundedGainPercent)
                .priceDiff(priceDiff)
                .recommendation(recommendation)
                .build();
    }

    /*
     * 비교 대상이 GPU인지 확인
     */
    private void validateGpuTarget(Product target) {

        if (target.getCategory() == null
                || !"GPU".equalsIgnoreCase(
                        target.getCategory()
                )) {

            throw new RuntimeException(
                    "현재는 GPU 상품만 비교할 수 있습니다."
            );
        }
    }

    /*
     * 성능 점수가 정상적으로 입력됐는지 확인
     */
    private void validatePerformanceScore(
            Product current,
            Product target
    ) {

        if (current.getPerformanceScore() == null
                || target.getPerformanceScore() == null) {

            throw new RuntimeException(
                    "비교할 상품의 성능 점수가 없습니다."
            );
        }

        if (current.getPerformanceScore() <= 0) {
            throw new RuntimeException(
                    "현재 부품의 성능 점수가 올바르지 않습니다."
            );
        }
    }

    /*
     * 단순 점수 차이에 따른 추천
     */
    private String createScoreRecommendation(
            int performanceDiff
    ) {

        if (performanceDiff >= 20) {
            return "업그레이드를 추천합니다.";
        }

        if (performanceDiff >= 10) {
            return "업그레이드를 고려해볼 수 있습니다.";
        }

        return "현재 부품을 계속 사용해도 충분합니다.";
    }

    /*
     * 성능 향상률에 따른 추천
     */
    private String createPercentRecommendation(
            double performanceGainPercent
    ) {

        if (performanceGainPercent >= 30) {
            return "업그레이드를 추천합니다.";
        }

        if (performanceGainPercent >= 15) {
            return "업그레이드를 고려해볼 수 있습니다.";
        }

        return "현재 부품을 계속 사용해도 충분합니다.";
    }
}