package com.SalinasEASWE.Holonode.filter;

import com.SalinasEASWE.Holonode.services.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

// Intercepts incoming requests to validate JWT tokens and set the security context for authenticated users
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    // Injects the JWT service to validate tokens and extract user information
    private final JwtService jwtService;

    // Constructs the filter with a dependency on the JwtService
    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    // Extracts and validates the JWT token from the request header and authenticates the user
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // Retrieves the Authorization header containing the JWT token from the request
        final String authHeader = request.getHeader("Authorization");

        // Extracts the token from the Bearer prefix if the header is present and properly formatted
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String authToken = authHeader.substring(7);

            // Validates the token and extracts the user ID if the token is valid
            if (jwtService.validateToken(authToken)) {
                Long userId = jwtService.getUserIdFromToken(authToken);

                // Creates an authentication token with the user ID and no authorities to represent the authenticated user
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userId,
                        null,
                        List.of()
                );

                // Sets the authentication in the security context to mark the user as authenticated for this request
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        // Passes the request to the next filter in the chain regardless of authentication status
        filterChain.doFilter(request, response);
    }
}
