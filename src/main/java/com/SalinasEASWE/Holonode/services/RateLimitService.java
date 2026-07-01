package com.SalinasEASWE.Holonode.services;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;

// Introduces a rate limiting service for rate limiting API requests
@Service
public class RateLimitService {
    // Creates a thread safe hash map to store rate limiting buckets
    ConcurrentHashMap<String, Bucket> buckets = new ConcurrentHashMap<>();

    // Implementation of a rate limiting bucket4j bucket that returns a bucket if it exists, otherwise creates a new one with
    // the given key, capacity, and duration. The duration token timer is based on the internal bucket4j creation timer.
    // It is very confusing, but at least gets the work done for now.
    public Bucket getOrCreateBucket(String key, int capacity, Duration duration) {
        return buckets.computeIfAbsent(key, k -> {
            return Bucket.builder()
                    // Adds capacity limit of bucket, refill capacity and duration, and finally builds it at the end
                    .addLimit(Bandwidth.builder()
                            .capacity(capacity)
                            .refillIntervally(capacity, duration)
                            .build())
                    .build();
        });
    }
}
