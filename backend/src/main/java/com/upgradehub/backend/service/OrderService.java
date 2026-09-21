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
import com.upgradehub.backend.entity.PurchasedPart;
import com.upgradehub.backend.repository.PurchasedPartRepository;
import com.upgradehub.backend.dto.PaymentPrepareResponse;
import com.upgradehub.backend.entity.UserAddress;
import com.upgradehub.backend.repository.UserAddressRepository;
import java.util.UUID;
import java.time.LocalDateTime;

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
        private final UserAddressRepository
        userAddressRepository;
    public OrderResponse createOrder(String email) {

        User user = userRepository
        .findByEmail(email)
        .orElseThrow(() ->
                new RuntimeException(
                        "사용자를 찾을 수 없습니다."
                )
        );

UserAddress address =
        userAddressRepository
                .findByIdAndUserId(
                        addressId,
                        user.getId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "선택한 배송지를 찾을 수 없습니다."
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

            addPurchasedPart(user,product,cartItem.getQuantity());

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
        orderItem.getProduct().getId(),
        orderItem.getProduct().getName(),
        orderItem.getProduct().getBrand(),
        orderItem.getOrderPrice(),
        orderItem.getQuantity(),
        orderItem.getOrderPrice() * orderItem.getQuantity()
        );
    }
    private final PurchasedPartRepository
        purchasedPartRepository;

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
                purchasedPart.getQuantity() +
                        quantity
        );

        purchasedPart.setPurchasedAt(
                LocalDateTime.now()
        );

        purchasedPartRepository.save(
                purchasedPart
        );
        }
        public PaymentPrepareResponse preparePayment(
        String email,
        Long addressId
) {
    User user = userRepository
            .findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException(
                            "사용자를 찾을 수 없습니다."
                    )
            );

    Cart cart = cartRepository
            .findByUserEmail(email)
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
        Product product =
                cartItem.getProduct();

        if (
                product.getStock()
                        < cartItem.getQuantity()
        ) {
            throw new RuntimeException(
                    product.getName()
                            + " 상품의 재고가 부족합니다."
            );
        }

        totalPrice +=
                product.getPrice()
                        * cartItem.getQuantity();
    }

    String paymentOrderId =
            "UPGRADEHUB_"
                    + UUID.randomUUID()
                            .toString()
                            .replace("-", "");

    Order order = Order.builder()
        .user(user)
        .totalPrice(totalPrice)
        .status(
                OrderStatus.PAYMENT_PENDING
        )
        .paymentOrderId(
                paymentOrderId
        )
        .recipientName(
                address.getRecipientName()
        )
        .recipientPhone(
                address.getPhone()
        )
        .postalCode(
                address.getPostalCode()
        )
        .roadAddress(
                address.getRoadAddress()
        )
        .detailAddress(
                address.getDetailAddress()
        )
        .build();

    Order savedOrder =
            orderRepository.save(order);

    for (CartItem cartItem : cartItems) {
        Product product =
                cartItem.getProduct();

        int quantity =
                cartItem.getQuantity();

        long orderPrice =
                product.getPrice();

        OrderItem orderItem =
                OrderItem.builder()
                        .order(savedOrder)
                        .product(product)
                        .orderPrice(orderPrice)
                        .quantity(quantity)
                        .subtotal(
                                orderPrice * quantity
                        )
                        .build();

        orderItemRepository.save(orderItem);
    }

    String firstProductName =
            cartItems.get(0)
                    .getProduct()
                    .getName();

    String orderName =
            cartItems.size() == 1
                    ? firstProductName
                    : firstProductName
                            + " 외 "
                            + (cartItems.size() - 1)
                            + "건";

    return new PaymentPrepareResponse(
            savedOrder.getId(),
            savedOrder.getPaymentOrderId(),
            savedOrder.getTotalPrice(),
            orderName,
            user.getName(),
            user.getEmail()
    );
}       
}