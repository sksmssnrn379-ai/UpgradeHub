package com.upgradehub.backend.service;

import com.upgradehub.backend.dto.MyPcPartRequest;
import com.upgradehub.backend.dto.PurchasedPartResponse;
import com.upgradehub.backend.entity.MyPc;
import com.upgradehub.backend.entity.Product;
import com.upgradehub.backend.entity.PurchasedPart;
import com.upgradehub.backend.entity.User;
import com.upgradehub.backend.repository.MyPcRepository;
import com.upgradehub.backend.repository.ProductRepository;
import com.upgradehub.backend.repository.PurchasedPartRepository;
import com.upgradehub.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MyPcService {

    private final MyPcRepository myPcRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    private final PurchasedPartRepository
            purchasedPartRepository;

    @Transactional(readOnly = true)
    public MyPc getMyPc(Long id) {
        return myPcRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "MY PC를 찾을 수 없습니다."
                        )
                );
    }

    @Transactional(readOnly = true)
    public MyPc getMyPcByEmail(
            String email
    ) {
        return myPcRepository
                .findByUserEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "등록된 MY PC가 없습니다."
                        )
                );
    }

    public MyPc createMyPc(
            String email,
            Long cpuId,
            Long gpuId,
            Long ramId
    ) {
        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "사용자를 찾을 수 없습니다."
                        )
                );

        if (
                myPcRepository
                        .findByUserEmail(email)
                        .isPresent()
        ) {
            throw new RuntimeException(
                    "이미 MY PC가 등록되어 있습니다."
            );
        }

        Product cpu = productRepository
                .findById(cpuId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "CPU 상품을 찾을 수 없습니다."
                        )
                );

        Product gpu = productRepository
                .findById(gpuId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "GPU 상품을 찾을 수 없습니다."
                        )
                );

        Product ram = productRepository
                .findById(ramId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "RAM 상품을 찾을 수 없습니다."
                        )
                );

        MyPc myPc = MyPc.builder()
                .user(user)
                .cpu(cpu)
                .gpu(gpu)
                .ram(ram)
                .build();

        return myPcRepository.save(myPc);
    }

    public MyPc installPurchasedPart(
            String email,
            MyPcPartRequest request
    ) {
        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "사용자를 찾을 수 없습니다."
                        )
                );

        Long productId =
                request.getProductId();

        PurchasedPart purchasedPart =
                purchasedPartRepository
                        .findByUserIdAndProductId(
                                user.getId(),
                                productId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "구매한 부품을 찾을 수 없습니다."
                                )
                        );

        if (
                purchasedPart.getQuantity() == null ||
                purchasedPart.getQuantity() <= 0
        ) {
            throw new RuntimeException(
                    "보유 수량이 없는 부품입니다."
            );
        }

        Product product =
                purchasedPart.getProduct();

        String category =
                product.getCategory() == null
                        ? ""
                        : product.getCategory()
                                .trim()
                                .toUpperCase();

        if (!isPcPart(category)) {
            throw new RuntimeException(
                    "MY PC에 등록할 수 없는 상품입니다."
            );
        }

        MyPc myPc = myPcRepository
                .findByUserEmail(email)
                .orElseGet(() ->
                        MyPc.builder()
                                .user(user)
                                .build()
                );

        switch (category) {
            case "CPU":
                myPc.setCpu(product);
                break;

            case "GPU":
                myPc.setGpu(product);
                break;

            case "RAM":
                myPc.setRam(product);
                break;

            case "SSD":
                myPc.setSsd(product);
                break;

            case "MOTHERBOARD":
                myPc.setMotherboard(product);
                break;

            case "POWER":
                myPc.setPower(product);
                break;

            default:
                throw new RuntimeException(
                        "현재 지원하지 않는 부품 종류입니다."
                );
        }

        return myPcRepository.save(myPc);
    }

    @Transactional(readOnly = true)
    public List<PurchasedPartResponse>
    getPurchasedParts(
            String email
    ) {
        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "사용자를 찾을 수 없습니다."
                        )
                );

        return purchasedPartRepository
                .findAllByUserIdOrderByPurchasedAtDesc(
                        user.getId()
                )
                .stream()
                .map(purchasedPart -> {
                    Product product =
                            purchasedPart
                                    .getProduct();

                    return PurchasedPartResponse
                            .builder()
                            .purchasedPartId(
                                    purchasedPart
                                            .getId()
                            )
                            .quantity(
                                    purchasedPart
                                            .getQuantity()
                            )
                            .purchasedAt(
                                    purchasedPart
                                            .getPurchasedAt()
                            )
                            .productId(
                                    product.getId()
                            )
                            .name(
                                    product.getName()
                            )
                            .brand(
                                    product.getBrand()
                            )
                            .category(
                                    product.getCategory()
                            )
                            .price(
                                    product.getPrice()
                            )
                            .performanceScore(
                                    product
                                            .getPerformanceScore()
                            )
                            .imageUrl(
                                    product.getImageUrl()
                            )
                            .build();
                })
                .toList();
    }

    private boolean isPcPart(
            String category
    ) {
        return switch (category) {
            case "CPU",
                 "GPU",
                 "RAM",
                 "SSD",
                 "MOTHERBOARD",
                 "POWER" -> true;

            default -> false;
        };
    }
}