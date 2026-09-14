package com.upgradehub.backend.service;

import com.upgradehub.backend.entity.MyPc;
import com.upgradehub.backend.entity.Product;
import com.upgradehub.backend.entity.User;
import com.upgradehub.backend.repository.MyPcRepository;
import com.upgradehub.backend.repository.ProductRepository;
import com.upgradehub.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.upgradehub.backend.dto.PurchasedPartResponse;
import com.upgradehub.backend.entity.OrderItem;
import com.upgradehub.backend.repository.OrderItemRepository;
import com.upgradehub.backend.entity.OrderStatus;
import java.util.List;
import com.upgradehub.backend.dto.MyPcPartRequest;
import com.upgradehub.backend.repository.PurchasedPartRepository;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class MyPcService {

    private final MyPcRepository myPcRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;

    public MyPc getMyPc(Long id) {
        return myPcRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("MY PC를 찾을 수 없습니다.")
                );
    }

    public MyPc getMyPcByEmail(String email) {
        return myPcRepository.findByUserEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("등록된 MY PC가 없습니다.")
                );
    }

    public MyPc createMyPc(
            String email,
            Long cpuId,
            Long gpuId,
            Long ramId
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("사용자를 찾을 수 없습니다.")
                );

        if (myPcRepository.findByUserEmail(email).isPresent()) {
            throw new RuntimeException(
                    "이미 MY PC가 등록되어 있습니다."
            );
        }

        Product cpu = productRepository.findById(cpuId)
                .orElseThrow(() ->
                        new RuntimeException("CPU 상품을 찾을 수 없습니다.")
                );

        Product gpu = productRepository.findById(gpuId)
                .orElseThrow(() ->
                        new RuntimeException("GPU 상품을 찾을 수 없습니다.")
                );

        Product ram = productRepository.findById(ramId)
                .orElseThrow(() ->
                        new RuntimeException("RAM 상품을 찾을 수 없습니다.")
                );

        MyPc myPc = MyPc.builder()
                .user(user)
                .cpu(cpu)
                .gpu(gpu)
                .ram(ram)
                .build();

        return myPcRepository.save(myPc);
    }
    public List<PurchasedPartResponse> getPurchasedParts(
        String email
        ) {

        return orderItemRepository
                .findByOrderUserEmailOrderByOrderOrderedAtDesc(
                        email
                )
                .stream()
                .filter(orderItem ->
                        isPcPart(
                                orderItem
                                        .getProduct()
                                        .getCategory()
                        )
                )
                .map(this::toPurchasedPartResponse)
                .toList();
        }
        private boolean isPcPart(
        String category
        ) {

        if (category == null) {
                return false;
        }

        return category.equalsIgnoreCase("CPU")
                || category.equalsIgnoreCase("GPU")
                || category.equalsIgnoreCase("RAM")
                || category.equalsIgnoreCase("SSD")
                || category.equalsIgnoreCase("MOTHERBOARD")
                || category.equalsIgnoreCase("POWER");
        }
        private PurchasedPartResponse toPurchasedPartResponse(
        OrderItem orderItem
        ) {

        return new PurchasedPartResponse(
                orderItem.getOrder().getId(),
                orderItem.getId(),
                orderItem.getProduct().getId(),
                orderItem.getProduct().getName(),
                orderItem.getProduct().getBrand(),
                orderItem.getProduct().getCategory(),
                orderItem.getQuantity(),
                orderItem.getOrderPrice(),
                orderItem.getOrder().getOrderedAt()
        );
        }
        public MyPc installPurchasedPart(
        String email,
        MyPcPartRequest request
        ) {

        OrderItem orderItem = orderItemRepository
                .findByIdAndOrderUserEmail(
                        request.getOrderItemId(),
                        email
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "구매한 부품을 찾을 수 없습니다."
                        )
                );

        if (orderItem.getOrder().getStatus()
                == OrderStatus.CANCELLED) {

                throw new RuntimeException(
                        "취소된 주문의 상품은 MY PC에 등록할 수 없습니다."
                );
        }

        Product product = orderItem.getProduct();

        String category = product.getCategory();

        if (!isPcPart(category)) {
                throw new RuntimeException(
                        "MY PC에 등록할 수 없는 상품입니다."
                );
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "사용자를 찾을 수 없습니다."
                        )
                );

        MyPc myPc = myPcRepository
                .findByUserEmail(email)
                .orElseGet(() ->
                        MyPc.builder()
                                .user(user)
                                .build()
                );

        switch (category.toUpperCase()) {

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
        private final PurchasedPartRepository
        purchasedPartRepository;

        @Transactional(readOnly = true)
        public List<PurchasedPartResponse>
        getPurchasedParts(Long userId) {

        return purchasedPartRepository
                .findAllByUserIdOrderByPurchasedAtDesc(
                        userId
                )
                .stream()
                .map(purchasedPart -> {
                        Product product =
                                purchasedPart.getProduct();

                        return PurchasedPartResponse
                                .builder()
                                .purchasedPartId(
                                        purchasedPart.getId()
                                )
                                .quantity(
                                        purchasedPart.getQuantity()
                                )
                                .purchasedAt(
                                        purchasedPart.getPurchasedAt()
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
                                        product.getPerformanceScore()
                                )
                                .imageUrl(
                                        product.getImageUrl()
                                )
                                .build();
                })
                .toList();
        }
}