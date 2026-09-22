package com.upgradehub.backend.repository;

import com.upgradehub.backend.entity.EmailVerification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmailVerificationRepository
        extends JpaRepository<EmailVerification, Long> {

    Optional<EmailVerification>
    findByEmailIgnoreCase(
            String email
    );

    void deleteByEmailIgnoreCase(
            String email
    );
}