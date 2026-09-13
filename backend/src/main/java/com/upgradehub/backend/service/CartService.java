package com.upgradehub.backend.service;

import com.upgradehub.backend.dto.CartItemRequest;
import com.upgradehub.backend.dto.CartItemResponse;
import com.upgradehub.backend.dto.CartResponse;
import com.upgradehub.backend.entity.Cart;
import com.upgradehub.backend.entity.CartItem;
import com.upgradehub.backend.entity.Product;
import com.upgradehub.backend.entity.User;
import com.upgradehub.backend.repository.CartItemRepository;
import com.upgradehub.backend.repository.CartRepository;
import com.upgradehub.backend.repository.ProductRepository;
import com.upgradehub.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.upgradehub.backend.dto.CartQuantityRequest;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    // 장바구니 상품 추가
    public CartItemResponse addItem(
            String email,
            CartItemRequest request
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "사용자를 찾을 수 없습니다."
                        )
                );

        Cart cart = cartRepository.findByUserEmail(email)
                .orElseGet(() -> createCart(user));

        Product product = productRepository
                .findById(request.getProductId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "상품을 찾을 수 없습니다."
                        )
                );

        if (product.getStock() < request.getQuantity()) {
            throw new RuntimeException(
                    "상품 재고가 부족합니다."
            );
        }

        CartItem cartItem = cartItemRepository
                .findByCartIdAndProductId(
                        cart.getId(),
                        product.getId()
                )
                .orElse(null);

        if (cartItem == null) {

            cartItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();

        } else {

            int newQuantity =
                    cartItem.getQuantity()
                            + request.getQuantity();

            if (product.getStock() < newQuantity) {
                throw new RuntimeException(
                        "상품 재고가 부족합니다."
                );
            }

            cartItem.setQuantity(newQuantity);
        }

        CartItem savedItem =
                cartItemRepository.save(cartItem);

        return toItemResponse(savedItem);
    }
    public CartItemResponse updateItemQuantity(
        String email,
        Long itemId,
        CartQuantityRequest request
        ) {

        CartItem cartItem = cartItemRepository
                .findByIdAndCartUserEmail(itemId, email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "장바구니 상품을 찾을 수 없습니다."
                        )
                );

        Product product = cartItem.getProduct();

        if (product.getStock() < request.getQuantity()) {
                throw new RuntimeException(
                        "상품 재고가 부족합니다."
                );
        }

        cartItem.setQuantity(request.getQuantity());

        CartItem savedItem =
                cartItemRepository.save(cartItem);

        return toItemResponse(savedItem);
        }

    // 로그인 사용자의 장바구니 조회
    @Transactional(readOnly = true)
    public CartResponse getCart(String email) {

        Cart cart = cartRepository.findByUserEmail(email)
                .orElse(null);

        if (cart == null) {
            return new CartResponse(
                    null,
                    List.of(),
                    0L
            );
        }

        List<CartItemResponse> items =
                cartItemRepository.findByCartId(cart.getId())
                        .stream()
                        .map(this::toItemResponse)
                        .toList();

        long totalPrice = items.stream()
                .mapToLong(CartItemResponse::getSubtotal)
                .sum();

        return new CartResponse(
                cart.getId(),
                items,
                totalPrice
        );
    }

    // 사용자 장바구니 생성
    private Cart createCart(User user) {

        Cart cart = Cart.builder()
                .user(user)
                .build();

        return cartRepository.save(cart);
    }

    // CartItem 엔티티를 응답 DTO로 변환
    private CartItemResponse toItemResponse(
            CartItem cartItem
    ) {

        Product product = cartItem.getProduct();

        long subtotal =
                product.getPrice()
                        * cartItem.getQuantity();

        return new CartItemResponse(
                cartItem.getId(),
                product.getId(),
                product.getName(),
                product.getBrand(),
                product.getPrice(),
                cartItem.getQuantity(),
                subtotal
        );
    }
    public void deleteItem(
        String email,
        Long itemId
        ) {

        CartItem cartItem = cartItemRepository
                .findByIdAndCartUserEmail(itemId, email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "장바구니 상품을 찾을 수 없습니다."
                        )
                );

        cartItemRepository.delete(cartItem);
        }
        public void clearCart(String email) {

        Cart cart = cartRepository.findByUserEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "장바구니를 찾을 수 없습니다."
                        )
                );

        cartItemRepository.deleteByCartId(cart.getId());
        }
}