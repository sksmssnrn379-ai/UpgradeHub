package com.upgradehub.backend.security;

import com.upgradehub.backend.entity.User;
import com.upgradehub.backend.entity.UserStatus;
import com.upgradehub.backend.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String token = resolveToken(request);

        if (
                token != null
                        && jwtUtil.isValidToken(token)
        ) {
            String email =
                    jwtUtil.getEmail(token);

            User user =
                    userRepository
                            .findByEmail(email)
                            .orElse(null);

            if (user == null) {
                SecurityContextHolder
                        .clearContext();

                response.sendError(
                        HttpServletResponse
                                .SC_UNAUTHORIZED,
                        "사용자를 찾을 수 없습니다."
                );

                return;
            }

            if (
                    user.getStatus()
                            != UserStatus.ACTIVE
            ) {
                SecurityContextHolder
                        .clearContext();

                response.sendError(
                        HttpServletResponse
                                .SC_FORBIDDEN,
                        "차단되었거나 사용할 수 없는 계정입니다."
                );

                return;
            }

            String role =
                    user.getRole();

            String authorityName =
                    role.startsWith("ROLE_")
                            ? role
                            : "ROLE_" + role;

            SimpleGrantedAuthority authority =
                    new SimpleGrantedAuthority(
                            authorityName
                    );

            UsernamePasswordAuthenticationToken
                    authentication =
                    new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            List.of(authority)
                    );

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(
                            authentication
                    );
        }

        filterChain.doFilter(
                request,
                response
        );
    }

    private String resolveToken(
            HttpServletRequest request
    ) {
        String authorization =
                request.getHeader(
                        "Authorization"
                );

        if (
                StringUtils.hasText(
                        authorization
                )
                        && authorization.startsWith(
                                "Bearer "
                        )
        ) {
            return authorization.substring(
                    7
            );
        }

        return null;
    }
}