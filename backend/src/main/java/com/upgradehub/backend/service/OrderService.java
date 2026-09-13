package com.upgradehub.backend.service;

import com.upgradehub.backend.dto.OrderItemResponse;
import com.upgradehub.backend.dto.OrderResponse;
import com.upgradehub.backend.entity.Cart;
import com.upgradehub.backend.entity.CartItem;
import com.upgradehub.backend.entity.Order;
import com.upgradehub.backend.entity.OrderItem;
import com.upgradehub.backend.entity.OrderStatus;
import com.upgradehub.backend.entity.Product;
import com.upgradehub.backend.entity.User;
import com.upgradehub.backend.repository.CartItemRepository;
import com.upgradehub.backend.repository.CartRepository;
import com.upgradehub.backend.repository.OrderItemRepository;
import com.upgradehub.backend.repository.OrderRepository;
import com.upgradehub.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;

    public OrderResponse createOrder(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "사용자를 찾을 수 없습니다."
                        )
                );

        Cart cart = cartRepository.findByUserEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "장바구니를 찾을 수 없습니다."
                        )
                );

        List<CartItem> cartItems =
                cartItemRepository.findByCartId(
                        cart.getId()
                );

        if (cartItems.isEmpty()) {
            throw new RuntimeException(
                    "장바구니가 비어 있습니다."
            );
        }

        long totalPrice = 0L;

        for (CartItem cartItem : cartItems) {

            Product product = cartItem.getProduct();

            if (product.getStock()
                    < cartItem.getQuantity()) {

                throw new RuntimeException(
                        product.getName()
                                + " 상품의 재고가 부족합니다."
                );
            }

            totalPrice += product.getPrice()
                    * cartItem.getQuantity();
        }

        Order order = Order.builder()
                .user(user)
                .totalPrice(totalPrice)
                .status(OrderStatus.ORDERED)
                .build();

        Order savedOrder =
                orderRepository.save(order);

        List<OrderItemResponse> itemResponses =
                new ArrayList<>();

        for (CartItem cartItem : cartItems) {

            Product product = cartItem.getProduct();

            long orderPrice = product.getPrice();

            long subtotal =
                    orderPrice * cartItem.getQuantity();

            OrderItem orderItem = OrderItem.builder()
                    .order(savedOrder)
                    .product(product)
                    .orderPrice(orderPrice)
                    .quantity(cartItem.getQuantity())
                    .subtotal(subtotal)
                    .build();

            OrderItem savedOrderItem =
                    orderItemRepository.save(orderItem);

            product.setStock(
                    product.getStock()
                            - cartItem.getQuantity()
            );

            itemResponses.add(
                    toItemResponse(savedOrderItem)
            );
        }

        cartItemRepository.deleteByCartId(
                cart.getId()
        );

        return new OrderResponse(
                savedOrder.getId(),
                savedOrder.getStatus().name(),
                savedOrder.getTotalPrice(),
                savedOrder.getOrderedAt(),
                itemResponses
        );
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrders(
            String email
    ) {

        return orderRepository
                .findByUserEmailOrderByOrderedAtDesc(
                        email
                )
                .stream()
                .map(this::toOrderResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrder(
            String email,
            Long orderId
    ) {

        Order order = orderRepository
                .findByIdAndUserEmail(
                        orderId,
                        email
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "주문을 찾을 수 없습니다."
                        )
                );

        return toOrderResponse(order);
    }

    private OrderResponse toOrderResponse(
            Order order
    ) {

        List<OrderItemResponse> items =
                orderItemRepository
                        .findByOrderId(order.getId())
                        .stream()
                        .map(this::toItemResponse)
                        .toList();

        return new OrderResponse(
                order.getId(),
                order.getStatus().name(),
                order.getTotalPrice(),
                order.getOrderedAt(),
                items
        );
    }

    private OrderItemResponse toItemResponse(
            OrderItem orderItem
    ) {

        Product product = orderItem.getProduct();

        return new OrderItemResponse(
                orderItem.getId(),
                product.getId(),
                product.getName(),
                product.getBrand(),
                orderItem.getOrderPrice(),
                orderItem.getQuantity(),
                orderItem.getSubtotal()
        );
    }
}