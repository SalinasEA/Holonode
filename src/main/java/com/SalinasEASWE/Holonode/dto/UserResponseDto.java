package com.SalinasEASWE.Holonode.dto;

// User response DTO, including the user's ID and username. This ensures that only the necessary information is sent back to the client
public class UserResponseDto {
    private Long id;

    private String username;

    // Getters and setters for UserResponseDto fields
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

}
