package com.upgradehub.backend.service;

import com.upgradehub.backend.entity.EmailVerification;
import com.upgradehub.backend.repository.EmailVerificationRepository;
import com.upgradehub.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class EmailVerificationService {

    private static final int
            CODE_EXPIRATION_MINUTES = 5;

    private static final int
            SIGNUP_EXPIRATION_MINUTES = 30;

    private static final int
            RESEND_INTERVAL_SECONDS = 60;

    private static final int
            MAX_ATTEMPTS = 5;

    private final EmailVerificationRepository
            emailVerificationRepository;

    private final UserRepository
            userRepository;

    private final EmailSenderService
            emailSenderService;

    private final PasswordEncoder
            passwordEncoder;

    private final SecureRandom
            secureRandom =
            new SecureRandom();

    public void sendCode(
            String rawEmail
    ) {
        String email =
                normalizeEmail(
                        rawEmail
                );

        if (
                userRepository
                        .findByEmail(email)
                        .isPresent()
        ) {
            throw new RuntimeException(
                    "이미 가입된 이메일입니다."
            );
        }

        LocalDateTime now =
                LocalDateTime.now();

        EmailVerification verification =
                emailVerificationRepository
                        .findByEmailIgnoreCase(email)
                        .orElse(null);

        if (
                verification != null
                        && verification
                        .getLastSentAt()
                        .plusSeconds(
                                RESEND_INTERVAL_SECONDS
                        )
                        .isAfter(now)
        ) {
            throw new RuntimeException(
                    "인증번호는 60초 후 다시 요청할 수 있습니다."
            );
        }

        String code =
                createCode();

        if (verification == null) {
            verification =
                    EmailVerification
                            .builder()
                            .email(email)
                            .createdAt(now)
                            .build();
        }

        verification.setVerificationCode(
                passwordEncoder.encode(
                        code
                )
        );

        verification.setExpiresAt(
                now.plusMinutes(
                        CODE_EXPIRATION_MINUTES
                )
        );

        verification.setVerifiedAt(null);
        verification.setAttemptCount(0);
        verification.setLastSentAt(now);

        emailVerificationRepository
                .saveAndFlush(
                        verification
                );

        emailSenderService
                .sendVerificationCode(
                        email,
                        code
                );
    }

    public void verifyCode(
            String rawEmail,
            String code
    ) {
        String email =
                normalizeEmail(
                        rawEmail
                );

        EmailVerification verification =
                emailVerificationRepository
                        .findByEmailIgnoreCase(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "인증 요청을 찾을 수 없습니다."
                                )
                        );

        LocalDateTime now =
                LocalDateTime.now();

        if (
                verification.getVerifiedAt()
                        != null
        ) {
            return;
        }

        if (
                verification.getExpiresAt()
                        .isBefore(now)
        ) {
            throw new RuntimeException(
                    "인증번호가 만료되었습니다."
            );
        }

        if (
                verification.getAttemptCount()
                        >= MAX_ATTEMPTS
        ) {
            throw new RuntimeException(
                    "인증 시도 횟수를 초과했습니다."
            );
        }

        verification.setAttemptCount(
                verification.getAttemptCount()
                        + 1
        );

        if (
                !passwordEncoder.matches(
                        code,
                        verification
                                .getVerificationCode()
                )
        ) {
            emailVerificationRepository.save(
                    verification
            );

            throw new RuntimeException(
                    "인증번호가 올바르지 않습니다."
            );
        }

        verification.setVerifiedAt(now);

        emailVerificationRepository.save(
                verification
        );
    }

    @Transactional(readOnly = true)
    public boolean isVerified(
            String rawEmail
    ) {
        String email =
                normalizeEmail(
                        rawEmail
                );

        return emailVerificationRepository
                .findByEmailIgnoreCase(email)
                .filter(
                        verification ->
                                verification
                                        .getVerifiedAt()
                                        != null
                )
                .filter(
                        verification ->
                                verification
                                        .getVerifiedAt()
                                        .plusMinutes(
                                                SIGNUP_EXPIRATION_MINUTES
                                        )
                                        .isAfter(
                                                LocalDateTime.now()
                                        )
                )
                .isPresent();
    }

    public void consumeVerification(
            String rawEmail
    ) {
        emailVerificationRepository
                .deleteByEmailIgnoreCase(
                        normalizeEmail(
                                rawEmail
                        )
                );
    }

    private String createCode() {
        int number =
                secureRandom.nextInt(
                        1_000_000
                );

        return String.format(
                "%06d",
                number
        );
    }

    private String normalizeEmail(
            String email
    ) {
        return email.trim()
                .toLowerCase();
    }
}