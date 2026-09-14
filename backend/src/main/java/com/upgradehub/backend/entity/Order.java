package com.upgradehub.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "orders")
public class Order {

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
            name = "total_price",
            nullable = false
    )
    private Long totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "status",
            nullable = false,
            length = 30
    )
    private OrderStatus status;

    @Column(
            name = "ordered_at",
            nullable = false
    )
    private LocalDateTime orderedAt;

    @Column(
            name = "payment_order_id",
            unique = true,
            length = 64
    )
    private String paymentOrderId;

    @Column(
            name = "payment_key",
            unique = true,
            length = 200
    )
    private String paymentKey;

    @Column(
            name = "payment_method",
            length = 50
    )
    private String paymentMethod;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @PrePersist
    public void prePersist() {
        if (orderedAt == null) {
            orderedAt =
                    LocalDateTime.now();
        }

        if (status == null) {
            status =
                    OrderStatus.ORDERED;
        }
    }
}