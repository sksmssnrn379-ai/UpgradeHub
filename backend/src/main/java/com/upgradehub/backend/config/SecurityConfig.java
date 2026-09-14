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

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .cors(cors -> cors.configurationSource(
                corsConfigurationSource()
                ))

                .formLogin(form -> form.disable())

                .httpBasic(basic -> basic.disable())

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

                        // 상품 목록 및 상세 조회
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

                        // 로그인 사용자 부품 비교
                        .requestMatchers(
                                HttpMethod.GET,
                                "/compare/me",
                                "/compare/mypc"
                        )
                        .authenticated()

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
                                "/cart/items/{itemId}",
                                "/mypc/parts"
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

                        .requestMatchers(
                        HttpMethod.POST,
                        "/ai/recommend"
                        )
                        .authenticated()

                        // 주문 목록 및 상세 조회
                        .requestMatchers(
                                HttpMethod.GET,
                                "/orders",
                                "/orders/{orderId}"
                        )
                        .authenticated()

                        // 그 외 요청
                        .anyRequest()
                        .permitAll()
                )

                .exceptionHandling(exception -> exception

                        // JWT가 없거나 인증에 실패한 경우
                        .authenticationEntryPoint(
                                new HttpStatusEntryPoint(
                                        HttpStatus.UNAUTHORIZED
                                )
                        )

                        // 로그인했지만 권한이 없는 경우
                        .accessDeniedHandler(
                                (
                                        request,
                                        response,
                                        accessDeniedException
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
        public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
        List.of(
                "http://localhost:5173",
                "https://main.xxxxxxxxx.amplifyapp.com"
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
                        "*"
                )
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
        }       
}