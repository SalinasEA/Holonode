package com.SalinasEASWE.Holonode.games.arelith.controllers;

import com.SalinasEASWE.Holonode.entities.Outfit;
import com.SalinasEASWE.Holonode.games.arelith.dto.ArelithOutfitDto;
import com.SalinasEASWE.Holonode.games.arelith.services.ArelithOutfitService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

// Extended Arelith outfit controller for handling Arelith outfit creation and update requests
@RestController
@RequestMapping("/api/arelith/outfits")
public class ArelithOutfitController {
    private final ArelithOutfitService arelithOutfitService;

    public ArelithOutfitController(ArelithOutfitService arelithOutfitService) {
        this.arelithOutfitService = arelithOutfitService;
    }

    // Handles outfit creation requests by creating a new outfit and returning a created response
    @PostMapping
    public ResponseEntity<Outfit> createOutfit(@RequestBody @Valid ArelithOutfitDto arelithOutfitDto) {
        // Get user ID from JWT authentication and creates outfit
        Long userId = (Long) Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getPrincipal();
        Outfit outfit = arelithOutfitService.createOutfit(arelithOutfitDto, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(outfit);
    }

    // Handles outfit update requests by updating an existing outfit by its ID and returning an updated response
    @PutMapping("/{id}")
    public ResponseEntity<Outfit> updateOutfitById(@PathVariable Long id, @RequestBody @Valid ArelithOutfitDto arelithOutfitDto) {
        Outfit outfit = arelithOutfitService.updateArelithOutfitById(id, arelithOutfitDto);
        return ResponseEntity.status(HttpStatus.OK).body(outfit);
    }
}
