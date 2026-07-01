package com.SalinasEASWE.Holonode.interceptors;

import com.SalinasEASWE.Holonode.services.RateLimitService;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import io.github.bucket4j.EstimationProbe;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jspecify.annotations.NonNull;
import org.springframework.web.servlet.HandlerInterceptor;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

public class RateLimitInterceptor implements HandlerInterceptor {
    // Injects the rate limiter service for future use
    private final RateLimitService rateLimitService;

    // Constructor to inject the RateLimitService
    public RateLimitInterceptor(RateLimitService rateLimitService) {
        this.rateLimitService = rateLimitService;
    }

    // Intercepts incoming requests and applies IP-based rate limiting to login and registration endpoints
    @Override
    public boolean preHandle(HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull Object handler) throws Exception {

        // Allows OPTIONS requests to proceed without rate limiting, ensures rate limiting message integrity
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        // Assigns the IP address of the client making the request
        String ip = request.getRemoteAddr();

        // Assigns the URL of the request
        String url = request.getRequestURI();

        // If the URL contains the register endpoint, set up rate limiting for attempts and successful registrations
        if (url.contains("api/users/register")) {
            // Applies a 5 requests per minute limit for registration attempts from this IP
            String attemptsKey = "register_attempt:" + ip;
            Bucket attemptsBucket = rateLimitService.getOrCreateBucket(attemptsKey, 5, Duration.ofMinutes(1));
            ConsumptionProbe attemptsProbe = attemptsBucket.tryConsumeAndReturnRemaining(1);

            // Applies a 2 successful registrations per hour limit for this IP to prevent abuse
            String successKey = "register_success:" + ip;
            Bucket successBucket = rateLimitService.getOrCreateBucket(successKey, 2, Duration.ofMinutes(60));
            EstimationProbe successProbe = successBucket.estimateAbilityToConsume(1);

            // Allows the request to proceed if both attempt and success limits have not been exceeded
            if (attemptsProbe.isConsumed() && successProbe.canBeConsumed()) {
                return true;
            }

            // Calculates the longest wait time between the two limits and returns a 429 response with that duration
            else {
                long attemptsWait = attemptsProbe.isConsumed() ? 0 : TimeUnit.NANOSECONDS.toSeconds(attemptsProbe.getNanosToWaitForRefill());
                long successWait = successProbe.canBeConsumed() ? 0 : TimeUnit.NANOSECONDS.toSeconds(successProbe.getNanosToWaitForRefill());
                long maxWait = Math.max(attemptsWait, successWait);

                response.setStatus(429);
                response.setHeader("Retry-After", String.valueOf(maxWait));

                return false;
            }
        }

        // If the URL contains the login endpoint, set up rate limiting for login attempts
        else if (url.contains("api/users/login")) {
            // Applies a 10 requests per minute limit for login attempts from this IP
            String loginKey = "login_attempt:" + ip;
            int loginCapacity = 10;
            Duration loginDuration = Duration.ofMinutes(1);
            Bucket loginBucket = rateLimitService.getOrCreateBucket(loginKey, loginCapacity, loginDuration);
            ConsumptionProbe loginProbe = loginBucket.tryConsumeAndReturnRemaining(1);

            // Allows the login request to proceed if the limit has not been exceeded
            if (loginProbe.isConsumed()) {
                return true;
            }

            // Calculates the wait time and returns a 429 response with the retry duration
            else {
                long waitSeconds = TimeUnit.NANOSECONDS.toSeconds(loginProbe.getNanosToWaitForRefill());
                response.setStatus(429);
                response.setHeader("Retry-After", String.valueOf(waitSeconds));
                return false;
            }
        }

        // If the URL does not contain the register or login endpoint, do not rate limit the request
        else {
            return true;
        }
    }
}
