package com.SalinasEASWE.Holonode.services;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

// Generates, validates, and extracts user information from JWT tokens for authentication
@Service
public class JwtService {
    // Loads JWT secret and expiration time from application properties and stores the signing key
    @Value("${jwt.secret}")
    private String secret;
    @Value("${jwt.expiration}")
    private long expiration;
    private SecretKey signingKey;

    // Converts the secret string into a secure signing key after the bean is constructed
    @PostConstruct
    private void initializeKey() {
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    // Creates a signed JWT token containing the user ID as the subject with an expiration time
    public String generateToken(Long userId) {
        return Jwts.builder()
            .subject(String.valueOf(userId))
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(signingKey)
            .compact();
    }

    // Verifies the token signature and expiration, returning true if valid or false if invalid or expired
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token);
            return true;
        }
        catch (Exception e) {
            return false;
        }
    }

    // Extracts and returns the user ID from a validated token's subject claim
    public Long getUserIdFromToken(String token) {
        try {
            String subject = Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
            return Long.parseLong(subject);
        }
        catch (Exception e) {
            return null;
        }
    }


}
