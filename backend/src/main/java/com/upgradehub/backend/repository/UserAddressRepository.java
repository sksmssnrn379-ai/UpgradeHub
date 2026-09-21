package com.upgradehub.backend.repository;

import com.upgradehub.backend.entity.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserAddressRepository
        extends JpaRepository<UserAddress, Long> {

    List<UserAddress>
    findByUserIdOrderByDefaultAddressDescIdDesc(
            Long userId
    );

    Optional<UserAddress>
    findByIdAndUserId(
            Long addressId,
            Long userId
    );

    Optional<UserAddress>
    findByUserIdAndDefaultAddressTrue(
            Long userId
    );

    long countByUserId(
            Long userId
    );
}