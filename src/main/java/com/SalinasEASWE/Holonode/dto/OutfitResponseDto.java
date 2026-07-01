package com.SalinasEASWE.Holonode.dto;

import com.SalinasEASWE.Holonode.entities.Outfit;

import java.time.LocalDateTime;
import java.util.List;

// Base OutfitResponseDto for returning outfit data in a response to the client,
// including the outfit's ID, title, username, list of outfits, and creation timestamp to create a report
public class OutfitResponseDto {
    private Long id;

    private String username;

    private String title;

    private List<Outfit> outfits;

    private LocalDateTime creationTimestamp;

    // Getters and setters for OutfitResponseDto fields
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

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

    public List<Outfit> getOutfits() {
        return outfits;
    }

    public void setOutfits(List<Outfit> outfits) {
        this.outfits = outfits;
    }

    public LocalDateTime getCreationTimestamp() {
        return creationTimestamp;
    }

    public void setCreationTimestamp(LocalDateTime creationTimestamp) {
        this.creationTimestamp = creationTimestamp;
    }
}
