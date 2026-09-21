package com.upgradehub.backend.controller;

import com.upgradehub.backend.dto.OrderResponse;
import com.upgradehub.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // 장바구니 상품으로 주문 생성
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse createOrder(
            Principal principal
    ) {
        String email = principal.getName();

        return orderService.createOrder(email, addressId);
    }

    // 로그인 사용자의 전체 주문 조회
    @GetMapping
    public List<OrderResponse> getOrders(
            Principal principal
    ) {
        String email = principal.getName();

        return orderService.getOrders(email);
    }

    // 로그인 사용자의 특정 주문 조회
    @GetMapping("/{orderId}")
    public OrderResponse getOrder(
            @PathVariable Long orderId,
            Principal principal
    ) {
        String email = principal.getName();

        return orderService.getOrder(
                email,
                orderId
        );
    }
}