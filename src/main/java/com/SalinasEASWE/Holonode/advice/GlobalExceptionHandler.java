package com.SalinasEASWE.Holonode.advice;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

// Handles exceptions globally across all controllers and returns structured error responses
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Catches validation errors and maps each invalid field to its error message
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        // Extracts the field name and error message from each validation error and adds them to the map
        ex.getBindingResult().getFieldErrors().forEach((error) -> {
            String fieldName = error.getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    // Catches database constraint violations and maps them to specific error messages
    @ExceptionHandler({DataIntegrityViolationException.class, JpaSystemException.class})
    public ResponseEntity<Map<String, String>> handleDatabaseConstraintViolation(Exception ex) {
        Map<String, String> errors = new HashMap<>();

        // Assigns message to the error message
        String message = ex.getMessage();

        // If the error message is related to a unique constraint violation, maps it to a specific error message
        if (message != null && message.contains("SQLITE_CONSTRAINT_UNIQUE")) {
            // If the message contains username or other relevant constraints, it assigns to the corresponding error message
            if (message.contains("user.username")) {
                errors.put("username", "Username is already taken. Please try again.");
            }
            else {
                errors.put("error", "An error occurred. Please check your inputs and try again.");
            }
        }
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    // Catches rate limit exceptions and returns a 429 response with the retry wait time in the header
    @ExceptionHandler(RateLimitExceededException.class)
    public ResponseEntity<Map<String, String>> handleRateLimitExceeded(RateLimitExceededException ex, HttpServletResponse response) {
        Map<String, String> errors = new HashMap<>();
        errors.put("error", "Too many requests. Please try again later.");

        response.setHeader("Retry-After", String.valueOf(ex.getRetryAfterSeconds()));

        return new ResponseEntity<>(errors, HttpStatus.TOO_MANY_REQUESTS);
    }
}
