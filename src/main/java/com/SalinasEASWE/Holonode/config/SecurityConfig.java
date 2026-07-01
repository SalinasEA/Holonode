package com.SalinasEASWE.Holonode.config;

import com.SalinasEASWE.Holonode.filter.JwtAuthenticationFilter;
import com.SalinasEASWE.Holonode.services.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

// Security configuration for enabling web security, enabling the Jwt auth filter, setting up a new BCryptPasswordEncoder instance,
// and defining the security filter chain for handling HTTP requests.
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    // Injects the JWT service to pass into the authentication filter
    private final JwtService jwtService;

    // Allowed origins variable for CORS
    @Value("${allowed.origins}")
    private String allowedOrigins;

    // Constructs the security config with a dependency on the JwtService
    public SecurityConfig(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    // Bean method to create a new BCryptPasswordEncoder instance
    @Bean
    protected BCryptPasswordEncoder newEncoderInstance() {
        return new BCryptPasswordEncoder();
    }

    // Bean method to configure the security filter chain for handling HTTP requests, including permitting access to specific endpoints
    // and disabling CSRF protection.
    @Bean
    protected SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // Creates a JWT authentication filter instance to validate tokens before authentication processing
        JwtAuthenticationFilter jwtAuthenticationFilter = new JwtAuthenticationFilter(jwtService);
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/users/register").permitAll()
                        .requestMatchers("/api/users/login").permitAll()
                        .requestMatchers("/api/outfits/**").authenticated()
                        .requestMatchers("/api/arelith/outfits/**").authenticated()
                        .anyRequest().authenticated()
                );

        // Creates a new SecurityFilterChain instance with the configured security settings
        return http.build();
    }

    // Bean method to define the Cross-Origin Resource Sharing (CORS) configuration source to handle cross-origin requests
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        // Defines the specific origins, HTTP methods, headers, and credential support permitted for cross-origin requests
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(allowedOrigins.split(",")));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("Retry-After"));
        configuration.setAllowCredentials(true);

        // Maps the specified CORS rules globally across all application endpoints and returns the source instance
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
