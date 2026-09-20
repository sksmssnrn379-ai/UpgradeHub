package com.upgradehub.backend.service;

import com.upgradehub.backend.dto.CompatibilityResponse;
import com.upgradehub.backend.entity.MyPc;
import com.upgradehub.backend.entity.Product;
import com.upgradehub.backend.entity.ProductSpec;
import com.upgradehub.backend.repository.MyPcRepository;
import com.upgradehub.backend.repository.ProductRepository;
import com.upgradehub.backend.repository.ProductSpecRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CompatibilityService {

    private final MyPcRepository myPcRepository;
    private final ProductRepository productRepository;
    private final ProductSpecRepository productSpecRepository;

    public CompatibilityResponse checkCompatibility(
            String email,
            Long targetProductId
    ) {

        MyPc myPc = myPcRepository.findByUserEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "등록된 MY PC가 없습니다."
                        )
                );

        Product targetProduct = productRepository
                .findById(targetProductId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "검사할 상품을 찾을 수 없습니다."
                        )
                );

        ProductSpec targetSpec = productSpecRepository
                .findByProduct_Id(targetProductId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "검사할 상품의 상세 사양이 없습니다."
                        )
                );

        String category = targetProduct.getCategory();

        if (category == null) {
            throw new RuntimeException(
                    "상품 카테고리가 등록되어 있지 않습니다."
            );
        }

        List<String> checks = new ArrayList<>();
        List<String> warnings = new ArrayList<>();

        switch (category.toUpperCase()) {

            case "CPU":
                checkCpu(
                        myPc,
                        targetSpec,
                        checks,
                        warnings
                );
                break;

            case "RAM":
                checkRam(
                        myPc,
                        targetSpec,
                        checks,
                        warnings
                );
                break;

            case "GPU":
                checkGpu(
                        myPc,
                        targetSpec,
                        checks,
                        warnings
                );
                break;

            case "SSD":
                checkSsd(
                        myPc,
                        targetSpec,
                        checks,
                        warnings
                );
                break;

            default:
                throw new RuntimeException(
                        "현재 호환성 검사를 지원하지 않는 카테고리입니다."
                );
        }

        boolean compatible = warnings.isEmpty();

        return new CompatibilityResponse(
                targetProduct.getId(),
                targetProduct.getName(),
                category.toUpperCase(),
                compatible,
                checks,
                warnings
        );
    }

    private void checkCpu(
            MyPc myPc,
            ProductSpec cpuSpec,
            List<String> checks,
            List<String> warnings
    ) {

        Product motherboard = myPc.getMotherboard();

        if (motherboard == null) {
            warnings.add(
                    "MY PC에 메인보드가 등록되어 있지 않습니다."
            );
            return;
        }

        ProductSpec motherboardSpec =
                findInstalledProductSpec(
                        motherboard,
                        "메인보드"
                );

        String cpuSocket = cpuSpec.getCpuSocket();
        String motherboardSocket =
                motherboardSpec.getCpuSocket();

        if (cpuSocket == null
                || motherboardSocket == null) {

            warnings.add(
                    "CPU 또는 메인보드의 소켓 정보가 없습니다."
            );
            return;
        }

        if (cpuSocket.equalsIgnoreCase(
                motherboardSocket
        )) {

            checks.add(
                    "CPU와 메인보드의 소켓이 "
                            + cpuSocket
                            + "으로 일치합니다."
            );

        } else {

            warnings.add(
                    "CPU 소켓 "
                            + cpuSocket
                            + "과 메인보드 소켓 "
                            + motherboardSocket
                            + "이 일치하지 않습니다."
            );
        }
    }

    private void checkRam(
            MyPc myPc,
            ProductSpec ramSpec,
            List<String> checks,
            List<String> warnings
    ) {

        Product motherboard = myPc.getMotherboard();

        if (motherboard == null) {
            warnings.add(
                    "MY PC에 메인보드가 등록되어 있지 않습니다."
            );
            return;
        }

        ProductSpec motherboardSpec =
                findInstalledProductSpec(
                        motherboard,
                        "메인보드"
                );

        String ramType = ramSpec.getMemoryType();
        String motherboardMemoryType =
                motherboardSpec.getMemoryType();

        if (ramType == null
                || motherboardMemoryType == null) {

            warnings.add(
                    "RAM 또는 메인보드의 메모리 규격 정보가 없습니다."
            );
            return;
        }

        if (ramType.equalsIgnoreCase(
                motherboardMemoryType
        )) {

            checks.add(
                    "RAM과 메인보드의 메모리 규격이 "
                            + ramType
                            + "로 일치합니다."
            );

        } else {

            warnings.add(
                    "RAM 규격 "
                            + ramType
                            + "와 메인보드 지원 규격 "
                            + motherboardMemoryType
                            + "이 일치하지 않습니다."
            );
        }
    }

    private void checkGpu(
            MyPc myPc,
            ProductSpec gpuSpec,
            List<String> checks,
            List<String> warnings
    ) {

        Product power = myPc.getPower();

        if (power == null) {
            warnings.add(
                    "MY PC에 파워서플라이가 등록되어 있지 않습니다."
            );
            return;
        }

        ProductSpec powerSpec =
                findInstalledProductSpec(
                        power,
                        "파워서플라이"
                );

        Integer recommendedPower =
                gpuSpec.getRecommendedPower();

        Integer powerCapacity =
                powerSpec.getPowerCapacity();

        if (recommendedPower == null
                || powerCapacity == null) {

            warnings.add(
                    "GPU 권장 파워 또는 파워서플라이 용량 정보가 없습니다."
            );
            return;
        }

        if (powerCapacity >= recommendedPower) {

            checks.add(
                    "파워서플라이 용량 "
                            + powerCapacity
                            + "W가 GPU 권장 파워 "
                            + recommendedPower
                            + "W 이상입니다."
            );

        } else {

            warnings.add(
                    "파워서플라이 용량 "
                            + powerCapacity
                            + "W가 GPU 권장 파워 "
                            + recommendedPower
                            + "W보다 부족합니다."
            );
        }
    }

    private void checkSsd(
            MyPc myPc,
            ProductSpec ssdSpec,
            List<String> checks,
            List<String> warnings
    ) {

        Product motherboard = myPc.getMotherboard();

        if (motherboard == null) {
            warnings.add(
                    "MY PC에 메인보드가 등록되어 있지 않습니다."
            );
            return;
        }

        ProductSpec motherboardSpec =
                findInstalledProductSpec(
                        motherboard,
                        "메인보드"
                );

        String ssdInterface =
                ssdSpec.getStorageInterface();

        String motherboardInterface =
                motherboardSpec.getStorageInterface();

        if (ssdInterface == null
                || motherboardInterface == null) {

            warnings.add(
                    "SSD 또는 메인보드의 저장장치 인터페이스 정보가 없습니다."
            );
            return;
        }

        if (ssdInterface.equalsIgnoreCase(
                motherboardInterface
        )) {

            checks.add(
                    "SSD와 메인보드의 저장장치 인터페이스가 "
                            + ssdInterface
                            + "로 일치합니다."
            );

        } else {

            warnings.add(
                    "SSD 인터페이스 "
                            + ssdInterface
                            + "와 메인보드 지원 인터페이스 "
                            + motherboardInterface
                            + "가 일치하지 않습니다."
            );
        }
    }

    private ProductSpec findInstalledProductSpec(
            Product product,
            String partName
    ) {

        return productSpecRepository
                .findByProduct_Id(product.getId())
                .orElseThrow(() ->
                        new RuntimeException(
                                partName
                                        + "의 상세 사양이 없습니다."
                        )
                );
    }
}