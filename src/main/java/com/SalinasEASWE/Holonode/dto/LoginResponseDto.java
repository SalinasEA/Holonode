package com.SalinasEASWE.Holonode.dto;

// Creates a DTO for returning a JWT token upon successful login
public class LoginResponseDto {
    private String token;

    public LoginResponseDto(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }
}
