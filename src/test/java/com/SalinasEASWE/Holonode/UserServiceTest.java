package com.SalinasEASWE.Holonode;

import com.SalinasEASWE.Holonode.dto.UserRegistrationDto;
import com.SalinasEASWE.Holonode.entities.User;
import com.SalinasEASWE.Holonode.repositories.UserRepository;
import com.SalinasEASWE.Holonode.services.RateLimitService;
import com.SalinasEASWE.Holonode.services.UserService;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.EstimationProbe;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;


// User service test class to verify user registration and password hashing
@SpringBootTest
public class UserServiceTest {
    // Before each test, sets up a mock Bucket4j bucket and ConsumptionProbe
    @BeforeEach
    void setUp() {
        // Creates a mock Bucket4j bucket that allows requests
        Bucket mockBucket = Mockito.mock(Bucket.class);

        // Creates a mock estimation probe from the Bucket4j library and configures it to return true for canBeConsumed
        EstimationProbe probe = Mockito.mock(EstimationProbe.class);
        Mockito.when(probe.canBeConsumed()).thenReturn(true);

        // Wires the mock bucket to return mock probe
        Mockito.when(mockBucket.estimateAbilityToConsume(Mockito.anyLong())).thenReturn(probe);

        // Makes getOrCreateBucket return the mock bucket
        Mockito.when(rateLimitService.getOrCreateBucket(
                Mockito.anyString(),
                Mockito.anyInt(),
                Mockito.any(java.time.Duration.class)
        )).thenReturn(mockBucket);
    }

    @Autowired
    private UserService userService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    // Mocks the RateLimitService so it allows tests to run without rates being enforced
    @MockitoBean
    private RateLimitService rateLimitService;

    @Test
    void registerUser_ShouldHashPassword() {
        // Given a user registration DTO with a password and confirm password that match
        UserRegistrationDto userRegistrationDto = new UserRegistrationDto();
        userRegistrationDto.setUsername("TestUser_" + System.currentTimeMillis());
        userRegistrationDto.setPassword("TestPassword");
        userRegistrationDto.setConfirmPassword("TestPassword");

        // When registering the user
        String ip = "127.0.0.1";
        User savedUser = userService.registerUser(userRegistrationDto, ip);

        // Then stored password should be hashed and not the original plain text password
        assertNotEquals("TestPassword", savedUser.getHashedPassword());

        // And BCrypt should verify the hashed password
        assertTrue(passwordEncoder.matches("TestPassword", savedUser.getHashedPassword()));

        // Delete the test user
        userRepository.deleteById(savedUser.getId());
    }
}
