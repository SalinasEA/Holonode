package com.SalinasEASWE.Holonode.advice;

// Custom exception class for rate limiting exceptions, supers the RuntimeException class
public class RateLimitExceededException extends RuntimeException{
    private final long retryAfterSeconds;

    public RateLimitExceededException(long retryAfterSeconds) {
        super("Rate limit exceeded");
        this.retryAfterSeconds = retryAfterSeconds;
    }

    public long getRetryAfterSeconds() {
        return retryAfterSeconds;
    }
}
