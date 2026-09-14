package com.upgradehub.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.upgradehub.backend.dto.PaymentConfirmRequest;
import com.upgradehub.backend.entity.Cart;
import com.upgradehub.backend.entity.Order;
import com.upgradehub.backend.entity.OrderItem;
import com.upgradehub.backend.entity.OrderStatus;
import com.upgradehub.backend.entity.Product;
import com.upgradehub.backend.entity.PurchasedPart;
import com.upgradehub.backend.entity.User;
import com.upgradehub.backend.repository.CartItemRepository;
import com.upgradehub.backend.repository.CartRepository;
import com.upgradehub.backend.repository.OrderItemRepository;
import com.upgradehub.backend.repository.OrderRepository;
import com.upgradehub.backend.repository.ProductRepository;
import com.upgradehub.backend.repository.PurchasedPartRepository;
import com.upgradehub.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private static final String TOSS_CONFIRM_URL =
            "https://api.tosspayments.com/v1/payments/confirm";

    private final OrderRepository
            orderRepository;

    private final OrderItemRepository
            orderItemRepository;

    private final UserRepository
            userRepository;

    private final ProductRepository
            productRepository;

    private final PurchasedPartRepository
            purchasedPartRepository;

    private final CartRepository
            cartRepository;

    private final CartItemRepository
            cartItemRepository;

    private final ObjectMapper
            objectMapper;

    @Value("${toss.secret-key}")
    private String tossSecretKey;

    @Transactional
    public Map<String, Object> confirmPayment(
            String email,
            PaymentConfirmRequest request
    ) {
        validateRequest(request);

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "사용자를 찾을 수 없습니다."
                        )
                );

        Order order = orderRepository
                .findByPaymentOrderIdAndUserEmail(
                        request.getOrderId(),
                        email
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "결제 대기 주문을 찾을 수 없습니다."
                        )
                );

        if (order.getStatus() == OrderStatus.PAID) {
            return handleAlreadyPaidOrder(
                    order,
                    request
            );
        }

        if (
                order.getStatus()
                        != OrderStatus.PAYMENT_PENDING
        ) {
            throw new RuntimeException(
                    "결제 가능한 주문 상태가 아닙니다. 현재 상태: "
                            + order.getStatus().name()
            );
        }

        if (
                !order.getTotalPrice()
                        .equals(request.getAmount())
        ) {
            order.setStatus(
                    OrderStatus.PAYMENT_FAILED
            );

            orderRepository.save(order);

            throw new RuntimeException(
                    "결제 금액이 주문 금액과 일치하지 않습니다."
            );
        }

        List<OrderItem> orderItems =
                orderItemRepository
                        .findByOrderId(
                                order.getId()
                        );

        if (orderItems.isEmpty()) {
            order.setStatus(
                    OrderStatus.PAYMENT_FAILED
            );

            orderRepository.save(order);

            throw new RuntimeException(
                    "주문 상품이 없습니다."
            );
        }

        validateStock(orderItems);

        Map<String, Object> tossPayment =
                requestTossConfirmation(
                        request
                );

        validateTossResponse(
                order,
                request,
                tossPayment
        );

        applyPaidOrder(
                user,
                order,
                orderItems,
                request,
                tossPayment
        );

        clearCart(email);

        Map<String, Object> result =
                new HashMap<>();

        result.put("success", true);
        result.put(
                "orderId",
                order.getId()
        );
        result.put(
                "paymentOrderId",
                order.getPaymentOrderId()
        );
        result.put(
                "paymentKey",
                order.getPaymentKey()
        );
        result.put(
                "status",
                order.getStatus().name()
        );
        result.put(
                "amount",
                order.getTotalPrice()
        );
        result.put(
                "paymentMethod",
                order.getPaymentMethod()
        );
        result.put(
                "message",
                "결제가 정상적으로 승인되었습니다."
        );

        return result;
    }

    private void validateRequest(
            PaymentConfirmRequest request
    ) {
        if (
                request == null ||
                request.getPaymentKey() == null ||
                request.getPaymentKey().isBlank()
        ) {
            throw new RuntimeException(
                    "결제 키가 필요합니다."
            );
        }

        if (
                request.getOrderId() == null ||
                request.getOrderId().isBlank()
        ) {
            throw new RuntimeException(
                    "결제 주문번호가 필요합니다."
            );
        }

        if (
                request.getAmount() == null ||
                request.getAmount() <= 0
        ) {
            throw new RuntimeException(
                    "결제 금액이 올바르지 않습니다."
            );
        }

        if (
                tossSecretKey == null ||
                tossSecretKey.isBlank()
        ) {
            throw new RuntimeException(
                    "결제 시크릿 키가 설정되지 않았습니다."
            );
        }

        if (
                !tossSecretKey.startsWith(
                        "test_gsk_"
                ) &&
                !tossSecretKey.startsWith(
                        "live_gsk_"
                )
        ) {
            throw new RuntimeException(
                    "결제 시크릿 키 형식이 올바르지 않습니다."
            );
        }
    }

    private Map<String, Object>
    handleAlreadyPaidOrder(
            Order order,
            PaymentConfirmRequest request
    ) {
        if (
                order.getPaymentKey() == null ||
                !order.getPaymentKey()
                        .equals(
                                request.getPaymentKey()
                        )
        ) {
            throw new RuntimeException(
                    "이미 다른 결제 정보로 완료된 주문입니다."
            );
        }

        Map<String, Object> result =
                new HashMap<>();

        result.put("success", true);
        result.put(
                "orderId",
                order.getId()
        );
        result.put(
                "paymentOrderId",
                order.getPaymentOrderId()
        );
        result.put(
                "paymentKey",
                order.getPaymentKey()
        );
        result.put(
                "status",
                order.getStatus().name()
        );
        result.put(
                "amount",
                order.getTotalPrice()
        );
        result.put(
                "message",
                "이미 승인된 결제입니다."
        );

        return result;
    }

    private void validateStock(
            List<OrderItem> orderItems
    ) {
        for (OrderItem orderItem : orderItems) {
            Product product =
                    orderItem.getProduct();

            if (
                    product.getStock()
                            < orderItem.getQuantity()
            ) {
                throw new RuntimeException(
                        product.getName()
                                + " 상품의 재고가 부족합니다."
                );
            }
        }
    }

    private Map<String, Object>
    requestTossConfirmation(
            PaymentConfirmRequest request
    ) {
        try {
            Map<String, Object> requestBody =
                    new HashMap<>();

            requestBody.put(
                    "paymentKey",
                    request.getPaymentKey()
            );

            requestBody.put(
                    "orderId",
                    request.getOrderId()
            );

            requestBody.put(
                    "amount",
                    request.getAmount()
            );

            String jsonBody =
                    objectMapper.writeValueAsString(
                            requestBody
                    );

            String credentials =
                    tossSecretKey + ":";

            String authorization =
                    Base64.getEncoder()
                            .encodeToString(
                                    credentials.getBytes(
                                            StandardCharsets.UTF_8
                                    )
                            );

            HttpRequest httpRequest =
                    HttpRequest.newBuilder()
                            .uri(
                                    URI.create(
                                            TOSS_CONFIRM_URL
                                    )
                            )
                            .header(
                                    "Authorization",
                                    "Basic "
                                            + authorization
                            )
                            .header(
                                    "Content-Type",
                                    "application/json"
                            )
                            .POST(
                                    HttpRequest.BodyPublishers
                                            .ofString(
                                                    jsonBody
                                            )
                            )
                            .build();

            HttpClient httpClient =
                    HttpClient.newBuilder()
                            .build();

            HttpResponse<String>
                    httpResponse =
                    httpClient.send(
                            httpRequest,
                            HttpResponse.BodyHandlers
                                    .ofString()
                    );

            Map<String, Object> responseBody =
                    objectMapper.readValue(
                            httpResponse.body(),
                            new TypeReference<
                                    Map<String, Object>
                            >() {
                            }
                    );

            if (
                    httpResponse.statusCode()
                            < 200 ||
                    httpResponse.statusCode()
                            >= 300
            ) {
                Object code =
                        responseBody.get("code");

                Object message =
                        responseBody.get("message");

                throw new RuntimeException(
                        "토스 결제 승인 실패"
                                + " ["
                                + String.valueOf(code)
                                + "]: "
                                + String.valueOf(
                                        message
                                )
                );
            }

            return responseBody;
        } catch (RuntimeException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new RuntimeException(
                    "토스 결제 승인 요청 중 오류가 발생했습니다: "
                            + exception.getMessage(),
                    exception
            );
        }
    }

    private void validateTossResponse(
            Order order,
            PaymentConfirmRequest request,
            Map<String, Object> tossPayment
    ) {
        String tossStatus =
                String.valueOf(
                        tossPayment.get("status")
                );

        String tossOrderId =
                String.valueOf(
                        tossPayment.get("orderId")
                );

        String tossPaymentKey =
                String.valueOf(
                        tossPayment.get(
                                "paymentKey"
                        )
                );

        long tossAmount =
                readLong(
                        tossPayment.get(
                                "totalAmount"
                        )
                );

        if (!"DONE".equals(tossStatus)) {
            throw new RuntimeException(
                    "결제가 승인 완료 상태가 아닙니다. 현재 상태: "
                            + tossStatus
            );
        }

        if (
                !order.getPaymentOrderId()
                        .equals(tossOrderId)
        ) {
            throw new RuntimeException(
                    "결제 승인 응답의 주문번호가 일치하지 않습니다."
            );
        }

        if (
                !request.getPaymentKey()
                        .equals(tossPaymentKey)
        ) {
            throw new RuntimeException(
                    "결제 승인 응답의 결제 키가 일치하지 않습니다."
            );
        }

        if (
                order.getTotalPrice()
                        .longValue()
                        != tossAmount
        ) {
            throw new RuntimeException(
                    "결제 승인 금액이 주문 금액과 일치하지 않습니다."
            );
        }
    }

    private void applyPaidOrder(
            User user,
            Order order,
            List<OrderItem> orderItems,
            PaymentConfirmRequest request,
            Map<String, Object> tossPayment
    ) {
        for (OrderItem orderItem : orderItems) {
            Product product =
                    orderItem.getProduct();

            int quantity =
                    orderItem.getQuantity();

            product.setStock(
                    product.getStock()
                            - quantity
            );

            productRepository.save(product);

            addPurchasedPart(
                    user,
                    product,
                    quantity
            );
        }

        order.setStatus(OrderStatus.PAID);

        order.setPaymentKey(
                request.getPaymentKey()
        );

        Object method =
                tossPayment.get("method");

        order.setPaymentMethod(
                method == null
                        ? null
                        : String.valueOf(method)
        );

        order.setPaidAt(
                parseApprovedAt(
                        tossPayment.get(
                                "approvedAt"
                        )
                )
        );

        orderRepository.save(order);
    }

    private void addPurchasedPart(
            User user,
            Product product,
            int quantity
    ) {
        PurchasedPart purchasedPart =
                purchasedPartRepository
                        .findByUserIdAndProductId(
                                user.getId(),
                                product.getId()
                        )
                        .orElseGet(() ->
                                PurchasedPart.builder()
                                        .user(user)
                                        .product(product)
                                        .quantity(0)
                                        .purchasedAt(
                                                LocalDateTime.now()
                                        )
                                        .build()
                        );

        purchasedPart.setQuantity(
                purchasedPart.getQuantity()
                        + quantity
        );

        purchasedPart.setPurchasedAt(
                LocalDateTime.now()
        );

        purchasedPartRepository.save(
                purchasedPart
        );
    }

    private void clearCart(
            String email
    ) {
        Cart cart = cartRepository
                .findByUserEmail(email)
                .orElse(null);

        if (cart != null) {
            cartItemRepository
                    .deleteByCartId(
                            cart.getId()
                    );
        }
    }

    private long readLong(
            Object value
    ) {
        if (value instanceof Number number) {
            return number.longValue();
        }

        try {
            return Long.parseLong(
                    String.valueOf(value)
            );
        } catch (Exception exception) {
            throw new RuntimeException(
                    "결제 승인 응답의 금액이 올바르지 않습니다."
            );
        }
    }

    private LocalDateTime parseApprovedAt(
            Object approvedAt
    ) {
        if (approvedAt == null) {
            return LocalDateTime.now();
        }

        try {
            return OffsetDateTime
                    .parse(
                            String.valueOf(
                                    approvedAt
                            )
                    )
                    .toLocalDateTime();
        } catch (Exception exception) {
            return LocalDateTime.now();
        }
    }
}