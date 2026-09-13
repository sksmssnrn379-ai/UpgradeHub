package com.upgradehub.backend.repository;

import com.upgradehub.backend.entity.MyPc;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;



public interface MyPcRepository
        extends JpaRepository<MyPc, Long> {
                Optional<MyPc> findByUserId(Long userId);
                Optional<MyPc> findByUserEmail(String email);
}