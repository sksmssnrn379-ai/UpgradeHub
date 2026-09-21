package com.upgradehub.backend.controller;

import com.upgradehub.backend.dto.PaymentConfirmRequest;
import com.upgradehub.backend.dto.PaymentPrepareResponse;
import com.upgradehub.backend.service.OrderService;
import com.upgradehub.backend.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.upgradehub.backend.dto.PaymentPrepareRequest;
import java.util.Map;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final OrderService orderService;
    private final PaymentService paymentService;

   @PostMapping("/prepare")
public ResponseEntity<PaymentPrepareResponse>
preparePayment(
        Authentication authentication,
        @Valid @RequestBody
        PaymentPrepareRequest request
) {
    return ResponseEntity.ok(
            orderService.preparePayment(
                    authentication.getName(),
                    request.getAddressId()
            )
    );
}

    @PostMapping("/confirm")
    public ResponseEntity<Map<String, Object>>
    confirmPayment(
            Authentication authentication,
            @Valid @RequestBody
            PaymentConfirmRequest request
    ) {
        return ResponseEntity.ok(
                paymentService.confirmPayment(
                        authentication.getName(),
                        request
                )
        );
    }
}