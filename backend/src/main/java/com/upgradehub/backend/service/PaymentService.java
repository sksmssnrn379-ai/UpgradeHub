package com.upgradehub.backend.service;

import com.upgradehub.backend.dto.PaymentConfirmRequest;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentService {

    public Map<String, Object> confirmPayment(
            String username,
            PaymentConfirmRequest request
    ) {
        Map<String, Object> result = new HashMap<>();

        result.put("success", true);
        result.put("username", username);

        return result;
    }
}