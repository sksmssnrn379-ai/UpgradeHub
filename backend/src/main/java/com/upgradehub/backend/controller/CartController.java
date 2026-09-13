package com.upgradehub.backend.controller;

import com.upgradehub.backend.dto.CartItemRequest;
import com.upgradehub.backend.dto.CartItemResponse;
import com.upgradehub.backend.dto.CartResponse;
import com.upgradehub.backend.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.upgradehub.backend.dto.CartQuantityRequest;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import java.security.Principal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    // 장바구니 상품 추가
    @PostMapping("/items")
    @ResponseStatus(HttpStatus.CREATED)
    public CartItemResponse addItem(
            @Valid @RequestBody CartItemRequest request,
            Principal principal
    ) {

        String email = principal.getName();

        return cartService.addItem(
                email,
                request
        );
    }

    // 로그인 사용자의 장바구니 조회
    @GetMapping
    public CartResponse getCart(
            Principal principal
    ) {

        String email = principal.getName();

        return cartService.getCart(email);
    }
    @PutMapping("/items/{itemId}")
    public CartItemResponse updateItemQuantity(
            @PathVariable Long itemId,
            @Valid @RequestBody CartQuantityRequest request,
            Principal principal
    ) {

        String email = principal.getName();

        return cartService.updateItemQuantity(
                email,
                itemId,
                request
        );
    }
    @DeleteMapping("/items/{itemId}")
        @ResponseStatus(HttpStatus.NO_CONTENT)
        public void deleteItem(
                @PathVariable Long itemId,
                Principal principal
        ) {

        String email = principal.getName();

        cartService.deleteItem(email, itemId);
        }
    @DeleteMapping
        @ResponseStatus(HttpStatus.NO_CONTENT)
        public void clearCart(
                Principal principal
        ) {

        String email = principal.getName();

        cartService.clearCart(email);
        }                
}