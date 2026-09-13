package com.upgradehub.backend.service;

import com.upgradehub.backend.dto.AiRecommendationRequest;
import com.upgradehub.backend.dto.AiRecommendationResponse;
import com.upgradehub.backend.dto.CompareResponse;
import com.upgradehub.backend.dto.CompatibilityResponse;
import com.upgradehub.backend.entity.Product;
import com.upgradehub.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AiRecommendationService {

    private final ProductRepository productRepository;
    private final CompareService compareService;
    private final CompatibilityService compatibilityService;

    public AiRecommendationResponse recommend(
            String email,
            AiRecommendationRequest request
    ) {

        Product targetProduct = productRepository
                .findById(request.getTargetProductId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "구매를 판단할 상품을 찾을 수 없습니다."
                        )
                );

        if (targetProduct.getCategory() == null
                || !"GPU".equalsIgnoreCase(
                        targetProduct.getCategory()
                )) {

            throw new RuntimeException(
                    "현재 AI 구매 판단은 GPU 상품만 지원합니다."
            );
        }

        CompareResponse compareResponse =
                compareService.compareLoginUser(
                        email,
                        targetProduct.getId()
                );

        CompatibilityResponse compatibilityResponse =
                compatibilityService.checkCompatibility(
                        email,
                        targetProduct.getId()
                );

        boolean withinBudget =
                targetProduct.getPrice()
                        <= request.getBudget();

        String recommendation = createRecommendation(
                compareResponse.getPerformanceGainPercent(),
                withinBudget,
                compatibilityResponse.isCompatible()
        );

        String reason = createReason(
                request,
                targetProduct,
                compareResponse,
                compatibilityResponse,
                withinBudget
        );

        return new AiRecommendationResponse(
                targetProduct.getId(),
                compareResponse.getCurrent(),
                targetProduct.getName(),
                compareResponse.getPerformanceGainPercent(),
                targetProduct.getPrice(),
                request.getBudget(),
                withinBudget,
                compatibilityResponse.isCompatible(),
                compatibilityResponse.getWarnings(),
                recommendation,
                reason
        );
    }

    private String createRecommendation(
            double performanceGainPercent,
            boolean withinBudget,
            boolean compatible
    ) {

        if (!compatible) {
            return "현재 PC 구성에서는 구매를 권장하지 않습니다.";
        }

        if (!withinBudget) {
            return "예산을 초과하므로 구매를 다시 검토해 주세요.";
        }

        if (performanceGainPercent >= 30) {
            return "업그레이드를 추천합니다.";
        }

        if (performanceGainPercent >= 15) {
            return "업그레이드를 고려해볼 수 있습니다.";
        }

        return "현재 부품을 계속 사용하는 것을 추천합니다.";
    }

    private String createReason(
            AiRecommendationRequest request,
            Product targetProduct,
            CompareResponse compareResponse,
            CompatibilityResponse compatibilityResponse,
            boolean withinBudget
    ) {

        StringBuilder reason = new StringBuilder();

        reason.append("사용 목적은 ");
        reason.append(request.getPurpose());
        reason.append("입니다. ");

        reason.append("현재 부품인 ");
        reason.append(compareResponse.getCurrent());
        reason.append("에서 ");
        reason.append(targetProduct.getName());
        reason.append("으로 변경하면 예상 성능 향상률은 ");
        reason.append(compareResponse.getPerformanceGainPercent());
        reason.append("%입니다. ");

        if (withinBudget) {
            reason.append("상품 가격은 사용자 예산 범위 안에 있습니다. ");
        } else {
            reason.append("상품 가격이 사용자 예산을 초과합니다. ");
        }

        if (compatibilityResponse.isCompatible()) {
            reason.append("현재 MY PC 구성과의 호환성 검사도 통과했습니다.");
        } else {
            reason.append("호환성 문제가 있으므로 구매 전에 PC 구성을 확인해야 합니다.");
        }

        return reason.toString();
    }
}