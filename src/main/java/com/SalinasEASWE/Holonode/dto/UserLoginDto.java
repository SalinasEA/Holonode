package com.SalinasEASWE.Holonode.dto;

import jakarta.validation.constraints.NotBlank;

// User login DTO for storing username and password with validation annotations for not-blank
public class UserLoginDto {
    @NotBlank(message = "Username cannot be blank. Please try again.")
    public String username;

    @NotBlank(message = "Password cannot be blank. Please try again.")
    public String password;

    // Getters and setters for username and password fields
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
