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

    @Enumerated(EnumType.STRING)
        @Column(
                nullable = false,
                length = 30
        )
        private OrderStatus status;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "user_id",
            nullable = false
    )
    private User user;

    @Column(nullable = false)
    private Long totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private OrderStatus status = OrderStatus.ORDERED;

    @Column(nullable = false)
    private LocalDateTime orderedAt;

    @PrePersist
    public void prePersist() {

        if (orderedAt == null) {
            orderedAt = LocalDateTime.now();
        }

        if (status == null) {
            status = OrderStatus.ORDERED;
        }
    }
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

@Column(
        name = "paid_at"
)
private LocalDateTime paidAt;
}