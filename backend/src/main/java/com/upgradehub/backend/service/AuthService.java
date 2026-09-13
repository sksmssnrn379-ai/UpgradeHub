package com.upgradehub.backend.service;

import com.upgradehub.backend.dto.LoginRequest;
import com.upgradehub.backend.dto.LoginResponse;
import com.upgradehub.backend.dto.SignupRequest;
import com.upgradehub.backend.entity.User;
import com.upgradehub.backend.repository.UserRepository;
import com.upgradehub.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.upgradehub.backend.dto.SignupResponse;
import com.upgradehub.backend.entity.Role;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public SignupResponse signup(SignupRequest request) {

    if (userRepository.findByEmail(request.getEmail()).isPresent()) {
        throw new RuntimeException(
                "이미 사용 중인 이메일입니다."
        );
    }

    String encodedPassword =
            passwordEncoder.encode(
                    request.getPassword()
            );

    User user = User.builder()
            .email(request.getEmail())
            .password(encodedPassword)
            .name(request.getName())
            .role(Role.USER)
            .build();

    User savedUser = userRepository.save(user);

    return new SignupResponse(
            savedUser.getId(),
            savedUser.getEmail(),
            savedUser.getName()
    );
}

    public LoginResponse login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException(
                                "등록되지 않은 이메일입니다."
                        )
                );

        boolean passwordMatches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );

        if (!passwordMatches) {
            throw new RuntimeException(
                    "비밀번호가 일치하지 않습니다."
            );
        }

        String token =
                jwtUtil.createToken(user.getEmail(),user.getRole());

        return new LoginResponse(token);
    }
}