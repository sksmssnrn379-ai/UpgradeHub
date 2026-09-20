package com.upgradehub.backend.security;

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
import com.upgradehub.backend.entity.User;
import com.upgradehub.backend.entity.UserStatus;
import com.upgradehub.backend.repository.UserRepository;


@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtUtil jwtUtil;
    private final UserRepository
        userRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String token = resolveToken(request);

        if (token != null && jwtUtil.isValidToken(token)) {

            String email = jwtUtil.getEmail(token);
            String role = user.getRole();
           
            User user = userRepository
        .findByEmail(email)
        .orElse(null);

        if (
        user == null ||
        user.getStatus()
                != UserStatus.ACTIVE
) {
    response.sendError(
            HttpServletResponse
                    .SC_FORBIDDEN,
            "사용할 수 없는 계정입니다."
    );

    return;
}

            String authorityName = role.startsWith("ROLE_")
                    ? role
                    : "ROLE_" + role;

            SimpleGrantedAuthority authority =
                    new SimpleGrantedAuthority(authorityName);

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            List.of(authority)
                    );

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(authentication);
        }
        

        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {

        String authorization =
                request.getHeader("Authorization");

        if (StringUtils.hasText(authorization)
                && authorization.startsWith("Bearer ")) {

            return authorization.substring(7);
        }

        return null;
    }
    
}