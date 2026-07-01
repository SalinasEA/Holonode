package com.SalinasEASWE.Holonode.services;

import com.SalinasEASWE.Holonode.advice.RateLimitExceededException;
import com.SalinasEASWE.Holonode.dto.UserLoginDto;
import com.SalinasEASWE.Holonode.dto.UserRegistrationDto;
import com.SalinasEASWE.Holonode.entities.User;
import com.SalinasEASWE.Holonode.repositories.UserRepository;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.EstimationProbe;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

// User service for user registration and password hashing
// and for user login and password verification using BCryptPasswordEncoder and UserRepository
@Service
public class UserService {
    private final BCryptPasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final RateLimitService rateLimitService;

    // Constructs a UserService with dependencies for password encoding and user repository
    public UserService(BCryptPasswordEncoder passwordEncoder, UserRepository userRepository, RateLimitService rateLimitService) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.rateLimitService = rateLimitService;
    }

    // Registers a new user after validating that the IP has not exceeded the successful registration limit
    public User registerUser(UserRegistrationDto userRegistrationDto, String ip) {
        // Retrieves or creates a bucket to track successful registrations for this IP with a 2 per hour limit
        String successKey = "register_success:" + ip;
        Bucket successBucket = rateLimitService.getOrCreateBucket(successKey, 2, Duration.ofMinutes(60));
        EstimationProbe successProbe = successBucket.estimateAbilityToConsume(1);

        // Throws a rate limit exception if the IP has already registered 2 users in the past hour
        if (!successProbe.canBeConsumed()) {
            long seconds = TimeUnit.NANOSECONDS.toSeconds(successProbe.getNanosToWaitForRefill());
            throw new RateLimitExceededException(seconds);
        }

        // Creates a new user entity with the provided username and hashed password
        User newUser = new User();
        newUser.setUsername(userRegistrationDto.getUsername());
        newUser.setHashedPassword(passwordEncoder.encode(userRegistrationDto.getPassword()));

        // Saves the new user to the database and returns the saved entity
        User savedUser = userRepository.save(newUser);

        // Consumes a token from the success bucket to record this successful registration
        successBucket.tryConsumeAndReturnRemaining(1);

        return savedUser;
    }

    // Checks if a user exists with the provided username and password using BCryptPasswordEncoder and UserRepository
    // and throws an exception if the credentials are invalid first, then returns the user if they are valid.
    public User loginUser(UserLoginDto userLoginDto) {
        User foundUser = userRepository.findByUsername(userLoginDto.getUsername());
        if (foundUser == null || !passwordEncoder.matches(userLoginDto.getPassword(), foundUser.getHashedPassword())) {
            throw new RuntimeException("Invalid username or password.");
        }
        else {
            return foundUser;
        }
    }
}
