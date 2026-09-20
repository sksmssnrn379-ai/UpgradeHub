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

    private final ProductRepository
            productRepository;

    private final CompareService
            compareService;

    private final CompatibilityService
            compatibilityService;

    public AiRecommendationResponse recommend(
            String email,
            AiRecommendationRequest request
    ) {
        String category =
                normalizeCategory(
                        request.getCategory()
                );

        Product targetProduct =
                productRepository
                        .findById(
                                request.getTargetProductId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "구매를 판단할 상품을 찾을 수 없습니다."
                                )
                        );

        validateTargetCategory(
                targetProduct,
                category
        );

        CompareResponse compareResponse =
                compareService.compareLoginUser(
                        email,
                        targetProduct.getId(),
                        category
                );

        CompatibilityResponse
                compatibilityResponse =
                compatibilityService
                        .checkCompatibility(
                                email,
                                targetProduct.getId()
                        );

        if (
        request.getBudget() == null
) {
    throw new RuntimeException(
            "예산을 입력해 주세요."
    );
}

boolean withinBudget =
        targetProduct.getPrice()
                <= request.getBudget();
                
        String recommendation =
                createRecommendation(
                        category,
                        compareResponse
                                .getPerformanceGainPercent(),
                        withinBudget,
                        compatibilityResponse
                                .isCompatible()
                );

        String reason =
                createReason(
                        category,
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
                compareResponse
                        .getPerformanceGainPercent(),
                targetProduct.getPrice(),
                request.getBudget(),
                withinBudget,
                compatibilityResponse
                        .isCompatible(),
                compatibilityResponse
                        .getWarnings(),
                recommendation,
                reason
        );
    }

    private String normalizeCategory(
            String category
    ) {
        if (
                category == null ||
                category.isBlank()
        ) {
            throw new RuntimeException(
                    "추천할 부품 종류가 필요합니다."
            );
        }

        String normalizedCategory =
                category.trim()
                        .toUpperCase();

        return switch (
                normalizedCategory
        ) {
            case "CPU",
                 "GPU",
                 "RAM",
                 "SSD",
                 "MOTHERBOARD",
                 "POWER" ->
                    normalizedCategory;

            default ->
                    throw new RuntimeException(
                            "지원하지 않는 부품 종류입니다."
                    );
        };
    }

    private void validateTargetCategory(
            Product targetProduct,
            String category
    ) {
        if (
                targetProduct.getCategory()
                        == null
        ) {
            throw new RuntimeException(
                    "선택한 상품에 카테고리 정보가 없습니다."
            );
        }

        String targetCategory =
                targetProduct
                        .getCategory()
                        .trim()
                        .toUpperCase();

        if (
                !category.equals(
                        targetCategory
                )
        ) {
            throw new RuntimeException(
                    "선택한 상품과 부품 종류가 일치하지 않습니다."
            );
        }
    }

    private String createRecommendation(
            String category,
            double performanceGainPercent,
            boolean withinBudget,
            boolean compatible
    ) {
        if (!compatible) {
            return getCompatibilityFailureMessage(
                    category
            );
        }

        if (!withinBudget) {
            return "예산을 초과하므로 구매를 다시 검토해 주세요.";
        }

        return switch (category) {
            case "CPU",
                 "GPU" ->
                    createPerformanceRecommendation(
                            performanceGainPercent
                    );

            case "RAM" ->
                    "메모리 규격과 현재 시스템의 호환성이 확인되었습니다. 필요한 용량과 예산을 고려해 구매할 수 있습니다.";

            case "SSD" ->
                    "저장장치 인터페이스와 현재 시스템의 호환성이 확인되었습니다. 필요한 저장 용량을 고려해 구매할 수 있습니다.";

            case "MOTHERBOARD" ->
                    "CPU 소켓과 메모리 규격을 포함한 호환성이 확인되었습니다. 장착 규격을 한 번 더 확인한 뒤 구매할 수 있습니다.";

            case "POWER" ->
                    "현재 시스템의 전력 요구사항을 충족하는지 확인되었습니다. 정격 용량과 전원 커넥터를 확인한 뒤 구매할 수 있습니다.";

            default ->
                    "호환성과 예산 조건을 충족하므로 구매를 검토할 수 있습니다.";
        };
    }

    private String
    createPerformanceRecommendation(
            double performanceGainPercent
    ) {
        if (
                performanceGainPercent
                        >= 30
        ) {
            return "업그레이드를 추천합니다.";
        }

        if (
                performanceGainPercent
                        >= 15
        ) {
            return "업그레이드를 고려해볼 수 있습니다.";
        }

        if (
                performanceGainPercent
                        > 0
        ) {
            return "성능 향상 폭이 크지 않으므로 가격과 사용 목적을 함께 고려해 주세요.";
        }

        return "현재 부품을 계속 사용하는 것을 추천합니다.";
    }

    private String
    getCompatibilityFailureMessage(
            String category
    ) {
        return switch (category) {
            case "CPU" ->
                    "CPU 소켓 또는 메모리 규격이 맞지 않아 현재 구성에서는 구매를 권장하지 않습니다.";

            case "GPU" ->
                    "그래픽카드 크기, 인터페이스 또는 전원 조건을 확인해야 하므로 현재 구성에서는 구매를 권장하지 않습니다.";

            case "RAM" ->
                    "메모리 규격이 현재 시스템과 맞지 않아 구매를 권장하지 않습니다.";

            case "SSD" ->
                    "저장장치 인터페이스가 현재 시스템과 맞지 않아 구매를 권장하지 않습니다.";

            case "MOTHERBOARD" ->
                    "CPU 소켓 또는 메모리 규격이 맞지 않아 구매를 권장하지 않습니다.";

            case "POWER" ->
                    "파워 용량이 현재 시스템의 전력 요구사항을 충족하지 않아 구매를 권장하지 않습니다.";

            default ->
                    "현재 PC 구성과 호환되지 않아 구매를 권장하지 않습니다.";
        };
    }

    private String createReason(
            String category,
            AiRecommendationRequest request,
            Product targetProduct,
            CompareResponse compareResponse,
            CompatibilityResponse compatibilityResponse,
            boolean withinBudget
    ) {
        String categoryLabel =
                getCategoryLabel(
                        category
                );

        StringBuilder reason =
                new StringBuilder();

        reason.append("사용 목적은 ");
        reason.append(
                request.getPurpose()
        );
        reason.append("입니다. ");

        reason.append("현재 ");
        reason.append(categoryLabel);
        reason.append("인 ");
        reason.append(
                compareResponse.getCurrent()
        );
        reason.append("에서 ");

        reason.append(
                targetProduct.getName()
        );
        reason.append(
                "으로 변경하는 조건을 분석했습니다. "
        );

        appendCategoryAnalysis(
                reason,
                category,
                compareResponse
                        .getPerformanceGainPercent()
        );

        if (withinBudget) {
            reason.append(
                    "상품 가격은 사용자 예산 범위 안에 있습니다. "
            );
        } else {
            reason.append(
                    "상품 가격이 사용자 예산을 초과합니다. "
            );
        }

        if (
                compatibilityResponse
                        .isCompatible()
        ) {
            reason.append(
                    "현재 MY PC 구성과의 호환성 검사도 통과했습니다."
            );
        } else {
            reason.append(
                    "호환성 문제가 있으므로 구매 전에 PC 구성을 확인해야 합니다."
            );
        }

        return reason.toString();
    }

    private void appendCategoryAnalysis(
            StringBuilder reason,
            String category,
            double performanceGainPercent
    ) {
        switch (category) {
            case "CPU", "GPU" -> {
                reason.append(
                        "예상 성능 변화율은 "
                );
                reason.append(
                        performanceGainPercent
                );
                reason.append("%입니다. ");
            }

            case "RAM" ->
                    reason.append(
                            "메모리는 단순 성능 점수보다 메모리 규격, 용량과 현재 메인보드 지원 여부를 중심으로 판단했습니다. "
                    );

            case "SSD" ->
                    reason.append(
                            "저장장치는 인터페이스 호환성과 필요한 저장 용량을 중심으로 판단했습니다. "
                    );

            case "MOTHERBOARD" ->
                    reason.append(
                            "메인보드는 CPU 소켓과 메모리 규격의 일치 여부를 중심으로 판단했습니다. "
                    );

            case "POWER" ->
                    reason.append(
                            "파워는 정격 용량과 시스템 전력 요구사항을 중심으로 판단했습니다. "
                    );

            default ->
                    reason.append(
                            "상품 규격과 현재 시스템의 조건을 비교했습니다. "
                    );
        }
    }

    private String getCategoryLabel(
            String category
    ) {
        return switch (category) {
            case "CPU" ->
                    "CPU";

            case "GPU" ->
                    "그래픽카드";

            case "RAM" ->
                    "메모리";

            case "SSD" ->
                    "저장장치";

            case "MOTHERBOARD" ->
                    "메인보드";

            case "POWER" ->
                    "파워서플라이";

            default ->
                    "부품";
        };
    }
}