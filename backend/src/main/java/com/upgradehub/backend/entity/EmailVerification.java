package com.upgradehub.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "email_verification")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailVerification {

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    @Column(
            nullable = false,
            unique = true,
            length = 255
    )
    private String email;

    @Column(
            name = "verification_code",
            nullable = false,
            length = 100
    )
    private String verificationCode;

    @Column(
            name = "expires_at",
            nullable = false
    )
    private LocalDateTime expiresAt;

    @Column(
            name = "verified_at"
    )
    private LocalDateTime verifiedAt;

    @Column(
            name = "attempt_count",
            nullable = false
    )
    @Builder.Default
    private Integer attemptCount = 0;

    @Column(
            name = "last_sent_at",
            nullable = false
    )
    private LocalDateTime lastSentAt;

    @Column(
            name = "created_at",
            nullable = false
    )
    private LocalDateTime createdAt;
}