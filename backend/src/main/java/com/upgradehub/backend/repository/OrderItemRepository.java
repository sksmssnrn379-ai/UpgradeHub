package com.upgradehub.backend.repository;

import com.upgradehub.backend.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderItemRepository
        extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrderId(
            Long orderId
    );

    List<OrderItem> findByOrderUserEmailOrderByOrderOrderedAtDesc(
            String email
    );

    Optional<OrderItem> findByIdAndOrderUserEmail(
            Long productId,
            String email
    );
}