package com.SalinasEASWE.Holonode.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

// Base outfit DTO for outfit creation. Includes validation annotations for not-null and not-blank, size constraints, and pattern validation
// for outfit name, description, and body types.
public class OutfitDto {
    // Validates that the outfit name is not empty and not blank, contains only letters, numbers, underscores, and spaces, and is between 1 and 32 characters long
    @NotNull(message = "Outfit name cannot be empty. Please try again.")
    @NotBlank(message = "Outfit name cannot be blank. Please try again.")
    @Pattern(regexp = "^([a-zA-Z0-9_\\s]+$)", message = "Outfit name can only contain letters, numbers, underscores, and spaces.")
    @Size(min = 1, max = 32, message = "Outfit name must be between 1 and 32 characters long.")
    private String outfitName;

    // Validates that the description is not longer than 300 characters
    @Size(max = 300, message = "Description cannot be longer than 300 characters.")
    private String outfitDescription;

    // Validates that the body type is not empty and not blank
    @NotNull(message = "Body type cannot be empty. Please try again.")
    @NotBlank(message = "Body type cannot be blank. Please try again.")
    private String bodyType;

    // Getters and setters for OutfitDto fields
    public String getOutfitName() {
        return outfitName;
    }

    public void setOutfitName(String outfitName) {
        this.outfitName = outfitName;
    }

    public String getOutfitDescription() {
        return outfitDescription;
    }

    public void setOutfitDescription(String outfitDescription) {
        this.outfitDescription = outfitDescription;
    }

    public String getBodyType() {
        return bodyType;
    }

    public void setBodyType(String bodyType) {
        this.bodyType = bodyType;
    }
}
