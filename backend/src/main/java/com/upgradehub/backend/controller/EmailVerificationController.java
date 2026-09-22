package com.upgradehub.backend.controller;

import com.upgradehub.backend.dto.EmailVerificationConfirmRequest;
import com.upgradehub.backend.dto.EmailVerificationSendRequest;
import com.upgradehub.backend.service.EmailVerificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth/email")
@RequiredArgsConstructor
public class EmailVerificationController {

    private final EmailVerificationService
            emailVerificationService;

    @PostMapping("/send")
    public ResponseEntity<Map<String, String>>
    sendCode(
            @Valid @RequestBody
            EmailVerificationSendRequest request
    ) {
        emailVerificationService.sendCode(
                request.getEmail()
        );

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "인증번호를 전송했습니다."
                )
        );
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, String>>
    verifyCode(
            @Valid @RequestBody
            EmailVerificationConfirmRequest request
    ) {
        emailVerificationService.verifyCode(
                request.getEmail(),
                request.getCode()
        );

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "이메일 인증이 완료되었습니다."
                )
        );
    }
}