package com.upgradehub.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_address")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAddress {

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "user_id",
            nullable = false
    )
    private User user;

    @Column(
            name = "address_name",
            nullable = false,
            length = 50
    )
    private String addressName;

    @Column(
            name = "recipient_name",
            nullable = false,
            length = 50
    )
    private String recipientName;

    @Column(
            nullable = false,
            length = 20
    )
    private String phone;

    @Column(
            name = "postal_code",
            nullable = false,
            length = 10
    )
    private String postalCode;

    @Column(
            name = "road_address",
            nullable = false,
            length = 255
    )
    private String roadAddress;

    @Column(
            name = "detail_address",
            length = 255
    )
    private String detailAddress;

    @Column(
            name = "is_default",
            nullable = false
    )
    @Builder.Default
    private Boolean defaultAddress = false;

    @Column(
            name = "created_at",
            nullable = false
    )
    @Builder.Default
    private LocalDateTime createdAt =
            LocalDateTime.now();

    @Column(
            name = "updated_at",
            nullable = false
    )
    @Builder.Default
    private LocalDateTime updatedAt =
            LocalDateTime.now();
}