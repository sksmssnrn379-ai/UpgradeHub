package com.upgradehub.backend.controller;

import com.upgradehub.backend.dto.AdminUserResponse;
import com.upgradehub.backend.dto.UserRoleUpdateRequest;
import com.upgradehub.backend.dto.UserStatusUpdateRequest;
import com.upgradehub.backend.service.AdminUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService
            adminUserService;

    @GetMapping
    public ResponseEntity<
            List<AdminUserResponse>
    > getUsers() {

        return ResponseEntity.ok(
                adminUserService.getUsers()
        );
    }

    @PutMapping("/{userId}/role")
    public ResponseEntity<
            AdminUserResponse
    > updateRole(
            @PathVariable Long userId,
            @Valid @RequestBody
            UserRoleUpdateRequest request
    ) {
        return ResponseEntity.ok(
                adminUserService.updateRole(
                        userId,
                        request.getRole()
                )
        );
    }

    @PutMapping("/{userId}/status")
    public ResponseEntity<
            AdminUserResponse
    > updateStatus(
            @PathVariable Long userId,
            @Valid @RequestBody
            UserStatusUpdateRequest request
    ) {
        return ResponseEntity.ok(
                adminUserService.updateStatus(
                        userId,
                        request.getStatus()
                )
        );
    }
}