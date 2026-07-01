package com.SalinasEASWE.Holonode.dto;

import com.SalinasEASWE.Holonode.validation.annotations.NewUserPasswordMatch;
import jakarta.validation.constraints.*;

// User registration DTO. Includes validation annotations for not-null and not-blank, size constraints, and pattern validation.
@NewUserPasswordMatch(message = "Passwords do not match. Please try again.")
public class UserRegistrationDto {
    // Validates that the username is not empty and not blank, contains only letters, numbers, and underscores, and is between 4 and 32 characters long
    @NotNull(message = "Username cannot be empty. Please try again.")
    @NotBlank(message = "Username cannot be blank. Please try again.")
    @Pattern(regexp = "^([a-zA-Z0-9_]+$)", message = "Username can only contain letters, numbers, and underscores.")
    @Size(min = 4, max = 32, message = "Username must be between 4 and 32 characters long.")
    private String username;

    // Validates that the password is not empty and not blank,
    // contains at least 1 number, 1 uppercase letter, 1 lowercase letter, and 1 special character, and is between 12 and 60 characters long
    @NotNull(message = "Password cannot be empty. Please try again.")
    @NotBlank(message = "Password cannot be blank. Please try again.")
    @Pattern.List({
            @Pattern(regexp = "^(?=.*\\d).+", message = "Password must contain at least 1 number."),
            @Pattern(regexp = "(?=.*[A-Z]).+", message = "Password must contain at least 1 uppercase letter."),
            @Pattern(regexp = "(?=.*[a-z]).+", message = "Password must contain at least 1 lowercase letter."),
            @Pattern(regexp = "(?=.*[!@#$%^&*()_+\\-=\\\\[\\\\]|;:'\",.<>/?]).+", message = "Password must contain at least 1 special character")
    })
    @Size(min = 12, max = 60, message = "Password must be between 12 and 60 characters long.")
    private String password;

    // Validates that the confirmPassword field is not empty and not blank,
    // contains at least 1 number, 1 uppercase letter, 1 lowercase letter, and 1 special character, and is between 12 and 60 characters long
    @NotNull(message = "Password cannot be empty. Please try again.")
    @NotBlank(message = "Password cannot be blank. Please try again.")
    @Pattern.List({
            @Pattern(regexp = "^(?=.*\\d).+", message = "Password must contain at least 1 number."),
            @Pattern(regexp = "(?=.*[A-Z]).+", message = "Password must contain at least 1 uppercase letter."),
            @Pattern(regexp = "(?=.*[a-z]).+", message = "Password must contain at least 1 lowercase letter."),
            @Pattern(regexp = "(?=.*[!@#$%^&*()_+\\-=\\\\[\\\\]|;:'\",.<>/?]).+", message = "Password must contain at least 1 special character")
    })
    @Size(min = 12, max = 60, message = "Password must be between 12 and 60 characters long.")
    private String confirmPassword;

    // Getters and setters for UserRegistrationDto fields
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

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }
}
