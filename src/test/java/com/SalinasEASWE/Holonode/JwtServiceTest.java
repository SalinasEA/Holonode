package com.SalinasEASWE.Holonode;

import com.SalinasEASWE.Holonode.services.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import static org.junit.jupiter.api.Assertions.*;

// Jwt service test class to verify JWT token generation and validation
@SpringBootTest
public class JwtServiceTest {

    @Autowired
    private JwtService jwtService;

    @Test
    void generateToken_ShouldReturnValidToken() {
        // Given a user ID
        Long userId = 1L;

        // When generating a token for the user
        String token = jwtService.generateToken(userId);

        // Then the token should be valid and contain the user ID as the subject
        assertNotNull(token);
        assertFalse(token.isEmpty());

        // And the token should be valid
        assertTrue(jwtService.validateToken(token));

        // And the user ID should be extracted from the token
        assertEquals(userId, jwtService.getUserIdFromToken(token));
    }
}
