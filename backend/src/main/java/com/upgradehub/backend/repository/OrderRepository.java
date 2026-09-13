package com.upgradehub.backend.repository;

import com.upgradehub.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository
        extends JpaRepository<Order, Long> {

    List<Order> findByUserEmailOrderByOrderedAtDesc(
            String email
    );

    Optional<Order> findByIdAndUserEmail(
            Long orderId,
            String email
    );
}