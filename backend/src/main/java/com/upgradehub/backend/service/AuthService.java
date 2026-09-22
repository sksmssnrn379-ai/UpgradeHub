package com.upgradehub.backend.service;

import com.upgradehub.backend.dto.LoginRequest;
import com.upgradehub.backend.dto.LoginResponse;
import com.upgradehub.backend.dto.SignupRequest;
import com.upgradehub.backend.dto.SignupResponse;
import com.upgradehub.backend.entity.Role;
import com.upgradehub.backend.entity.User;
import com.upgradehub.backend.entity.UserStatus;
import com.upgradehub.backend.repository.UserRepository;
import com.upgradehub.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // 추가
    private final EmailVerificationService emailVerificationService;

    public SignupResponse signup(SignupRequest request) {

        String normalizedEmail =
                request.getEmail()
                        .trim()
                        .toLowerCase();

        // 이메일 인증 여부 확인
        if (!emailVerificationService.isVerified(normalizedEmail)) {
            throw new RuntimeException(
                    "이메일 인증을 완료해 주세요."
            );
        }

        // 이미 가입된 이메일인지 확인
        if (userRepository.findByEmail(normalizedEmail).isPresent()) {
            throw new RuntimeException(
                    "이미 사용 중인 이메일입니다."
            );
        }

        // 인증 완료 상태 사용 처리
        emailVerificationService.consumeVerification(
                normalizedEmail
        );

        String encodedPassword =
                passwordEncoder.encode(
                        request.getPassword()
                );

        User user = User.builder()
                .email(normalizedEmail)
                .password(encodedPassword)
                .name(request.getName())
                .role(Role.USER)
                .build();

        User savedUser =
                userRepository.save(user);

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

        if (user.getStatus() == UserStatus.BLOCKED) {
            throw new RuntimeException(
                    "차단된 계정입니다. 관리자에게 문의해 주세요."
            );
        }

        String token =
                jwtUtil.createToken(
                        user.getEmail(),
                        user.getRole()
                );

        return new LoginResponse(
                token,
                user.getRole().name()
        );
    }
}