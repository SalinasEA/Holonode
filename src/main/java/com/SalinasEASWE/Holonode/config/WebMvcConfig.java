package com.SalinasEASWE.Holonode.config;

import com.SalinasEASWE.Holonode.interceptors.RateLimitInterceptor;
import com.SalinasEASWE.Holonode.services.RateLimitService;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// Registers the rate limit interceptor to apply rate limiting across all incoming requests
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    // Injects the RateLimitService into the WebMvcConfigurer implementation
    private final RateLimitService rateLimitService;

    // Constructor to inject the RateLimitService
    public WebMvcConfig(RateLimitService rateLimitService) {
        this.rateLimitService = rateLimitService;
    }

    // Override the addInterceptors method to register the RateLimitInterceptor
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new RateLimitInterceptor(rateLimitService));
    }
}
