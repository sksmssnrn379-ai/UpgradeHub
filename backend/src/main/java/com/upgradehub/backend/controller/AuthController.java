package com.upgradehub.backend.controller;

import com.upgradehub.backend.dto.LoginRequest;
import com.upgradehub.backend.dto.LoginResponse;
import com.upgradehub.backend.dto.SignupRequest;
import com.upgradehub.backend.dto.SignupResponse;
import com.upgradehub.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(
            @Valid @RequestBody LoginRequest request
    ) {
        return authService.login(request);
    }
    @PostMapping("/signup")
    public SignupResponse signup(
            @Valid @RequestBody SignupRequest request
    ) {
        return authService.signup(request);
    }
}