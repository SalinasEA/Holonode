package com.SalinasEASWE.Holonode.controllers;

import com.SalinasEASWE.Holonode.dto.LoginResponseDto;
import com.SalinasEASWE.Holonode.dto.UserLoginDto;
import com.SalinasEASWE.Holonode.dto.UserRegistrationDto;
import com.SalinasEASWE.Holonode.dto.UserResponseDto;
import com.SalinasEASWE.Holonode.entities.User;
import com.SalinasEASWE.Holonode.services.JwtService;
import com.SalinasEASWE.Holonode.services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// User controller for handling user registration requests
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final JwtService jwtService;

    // Constructs a UserController with a dependency on the UserService
    public UserController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    // Handles user registration requests by creating a new user and returning a created response
    @PostMapping("/register")
    public ResponseEntity<UserResponseDto> registerUser(@RequestBody @Valid UserRegistrationDto userRegistrationDto, HttpServletRequest request) {
        String ip = request.getRemoteAddr();
        User user = userService.registerUser(userRegistrationDto, ip);

        // Maps the saved user entity to a response DTO containing only the id and username
        UserResponseDto userResponse = new UserResponseDto();
        userResponse.setId(user.getId());
        userResponse.setUsername(user.getUsername());

        return ResponseEntity.status(HttpStatus.CREATED).body(userResponse);
    }

    // Handles user login requests by validating credentials and returning a JWT token
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> loginUser(@RequestBody @Valid UserLoginDto userLoginDto) {
        User user = userService.loginUser(userLoginDto);

        // Generates a JWT token for the authenticated user and wraps it in a response DTO
        Long userId = user.getId();
        String token = jwtService.generateToken(userId);
        LoginResponseDto loginResponseDto = new LoginResponseDto(token);

        return ResponseEntity.ok(loginResponseDto);
    }
}
