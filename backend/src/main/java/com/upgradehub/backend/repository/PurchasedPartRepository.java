package com.upgradehub.backend.repository;

import com.upgradehub.backend.entity.PurchasedPart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface PurchasedPartRepository
        extends JpaRepository<PurchasedPart, Long> {

    List<PurchasedPart> findAllByUserIdOrderByPurchasedAtDesc(
            Long userId
    );

    Optional<PurchasedPart> findByUserIdAndProductId(
            Long userId,
            Long productId
    );

    boolean existsByUserIdAndProductId(
            Long userId,
            Long productId
    );
}