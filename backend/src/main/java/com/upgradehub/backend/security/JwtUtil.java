package com.upgradehub.backend.security;

import com.upgradehub.backend.entity.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import org.springframework.beans.factory.annotation.Value;


@Component
public class JwtUtil {
        private final String secret;
        public JwtUtil(@Value("${jwt.secret}")String secret) {this.secret = secret;}
    private static final String SECRET =
            "upgradehub-secret-key-upgradehub-secret-key";

    private static final long EXPIRATION_TIME =
            1000L * 60 * 60;

    private final SecretKey secretKey =
            Keys.hmacShaKeyFor(
                    SECRET.getBytes(StandardCharsets.UTF_8)
            );

    public String createToken(
            String email,
            Role role
    ) {

        Date now = new Date();

        Date expiration =
                new Date(now.getTime() + EXPIRATION_TIME);

        return Jwts.builder()
                .subject(email)
                .claim("role", role.name())
                .issuedAt(now)
                .expiration(expiration)
                .signWith(secretKey)
                .compact();
    }

    public String getEmail(String token) {
        return getClaims(token).getSubject();
    }

    public String getRole(String token) {
        return getClaims(token)
                .get("role", String.class);
    }

    public boolean isValidToken(String token) {

        try {
            getClaims(token);
            return true;

        } catch (Exception exception) {
            return false;
        }
    }

    private Claims getClaims(String token) {

        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}