package com.upgradehub.backend.controller;

import com.upgradehub.backend.dto.PaymentPrepareResponse;
import com.upgradehub.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final OrderService orderService;

    @PostMapping("/prepare")
    public ResponseEntity<PaymentPrepareResponse>
    preparePayment(
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                orderService.preparePayment(
                        authentication.getName()
                )
        );
    }
}