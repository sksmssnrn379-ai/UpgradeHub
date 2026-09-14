package com.upgradehub.backend.config;

import com.upgradehub.backend.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter
            jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )

                .csrf(csrf ->
                        csrf.disable()
                )

                .formLogin(form ->
                        form.disable()
                )

                .httpBasic(basic ->
                        basic.disable()
                )

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // 회원가입과 로그인
                        .requestMatchers(
                                "/auth/signup",
                                "/auth/login"
                        )
                        .permitAll()

                        // 상품 목록 및 상품 상세 조회
                        .requestMatchers(
                                HttpMethod.GET,
                                "/products",
                                "/products/{id}",
                                "/products/{productId}/spec"
                        )
                        .permitAll()

                        // 관리자 상품 등록
                        .requestMatchers(
                                HttpMethod.POST,
                                "/products",
                                "/products/{productId}/spec"
                        )
                        .hasRole("ADMIN")

                        // 관리자 상품 수정
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/products/{id}",
                                "/products/{productId}/spec"
                        )
                        .hasRole("ADMIN")

                        // 관리자 상품 삭제
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/products/{id}"
                        )
                        .hasRole("ADMIN")

                        // MY PC 조회
                        .requestMatchers(
                                HttpMethod.GET,
                                "/mypc/purchased-parts",
                                "/mypc/me",
                                "/mypc/{id}"
                        )
                        .authenticated()
                                                

                        // MY PC 등록
                        .requestMatchers(
                                HttpMethod.POST,
                                "/mypc/me"
                        )
                        .authenticated()

                        // MY PC 부품 변경
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/mypc/parts"
                        )
                        .authenticated()

                        // 로그인 사용자의 부품 비교
                        .requestMatchers(
                                HttpMethod.GET,
                                "/compare/me",
                                "/compare/mypc"
                        )
                        .authenticated()

                        // 호환성 검사
                        .requestMatchers(
                                HttpMethod.GET,
                                "/compatibility/check"
                        )
                        .authenticated()

                        // 장바구니 조회
                        .requestMatchers(
                                HttpMethod.GET,
                                "/cart"
                        )
                        .authenticated()

                        // 장바구니 상품 추가
                        .requestMatchers(
                                HttpMethod.POST,
                                "/cart/items"
                        )
                        .authenticated()

                        // 장바구니 수량 변경
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/cart/items/{itemId}"
                        )
                        .authenticated()

                        // 장바구니 상품 및 전체 삭제
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/cart",
                                "/cart/items/{itemId}"
                        )
                        .authenticated()

                        // 주문 생성
                        .requestMatchers(
                                HttpMethod.POST,
                                "/orders"
                        )
                        .authenticated()

                        // 주문 목록 및 상세 조회
                        .requestMatchers(
                                HttpMethod.GET,
                                "/orders",
                                "/orders/{orderId}"
                        )
                        .authenticated()

                        // AI 구매 추천
                        .requestMatchers(
                                HttpMethod.POST,
                                "/ai/recommend"
                        )
                        .authenticated()
                        
                        .requestMatchers(
                        HttpMethod.POST,
                        "/admin/performance-scores/recalculate"
                        )
                        .hasRole("ADMIN")
                        
                        .requestMatchers(
                        HttpMethod.POST,
                        "/payments/prepare",
                        "/payments/confirm"
                        )
                        .authenticated()
                        
                        // 나머지 요청
                        .anyRequest()
                        .permitAll()
                )

                .exceptionHandling(exception ->
                        exception
                                .authenticationEntryPoint(
                                        new HttpStatusEntryPoint(
                                                HttpStatus.UNAUTHORIZED
                                        )
                                )
                                .accessDeniedHandler(
                                        (
                                                request,
                                                response,
                                                ex
                                        ) -> response.sendError(
                                                HttpStatus.FORBIDDEN.value(),
                                                "접근 권한이 없습니다."
                                        )
                                )
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource
    corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:5173",
                        "https://main.d33e7cb1duv204.amplifyapp.com"
                )
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "PATCH",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of(
                        "Authorization",
                        "Content-Type",
                        "Accept",
                        "Origin",
                        "X-Requested-With"
                )
        );

        configuration.setExposedHeaders(
                List.of(
                        "Authorization"
                )
        );

        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }
}