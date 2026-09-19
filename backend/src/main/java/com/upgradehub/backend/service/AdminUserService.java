package com.upgradehub.backend.service;

import com.upgradehub.backend.dto.AdminUserResponse;
import com.upgradehub.backend.entity.User;
import com.upgradehub.backend.entity.UserStatus;
import com.upgradehub.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.upgradehub.backend.entity.Role;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminUserService {

    private final UserRepository
            userRepository;

    @Transactional(readOnly = true)
    public List<AdminUserResponse>
    getUsers() {

        return userRepository
                .findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public AdminUserResponse updateRole(
            Long userId,
            String role
    ) {
        User user = findUser(userId);

        String normalizedRole =
                role.trim().toUpperCase();

        if (
                !normalizedRole.equals("USER") &&
                !normalizedRole.equals("ADMIN")
        ) {
            throw new RuntimeException(
                    "지원하지 않는 사용자 권한입니다."
            );
        }

        user.setRole(Role.valueOf(normalizedRole));

        return toResponse(
                userRepository.save(user)
        );
    }

    public AdminUserResponse updateStatus(
            Long userId,
            String status
    ) {
        User user = findUser(userId);

        UserStatus userStatus;

        try {
            userStatus =
                    UserStatus.valueOf(
                            status.trim()
                                    .toUpperCase()
                    );
        } catch (
                IllegalArgumentException exception
        ) {
            throw new RuntimeException(
                    "지원하지 않는 사용자 상태입니다."
            );
        }

        user.setStatus(userStatus);

        return toResponse(
                userRepository.save(user)
        );
    }

    private User findUser(
            Long userId
    ) {
        return userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "사용자를 찾을 수 없습니다."
                        )
                );
    }

    private AdminUserResponse toResponse(
            User user
    ) {
        return AdminUserResponse
                .builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().name())
                .status(
                        user.getStatus().name()
                )
                .build();
    }
}