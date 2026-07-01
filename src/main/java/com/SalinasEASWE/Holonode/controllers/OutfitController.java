package com.SalinasEASWE.Holonode.controllers;

import com.SalinasEASWE.Holonode.dto.OutfitResponseDto;
import com.SalinasEASWE.Holonode.entities.Outfit;
import com.SalinasEASWE.Holonode.services.OutfitService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// Base outfit controller for managing outfits and CRUD operations
@RestController
@RequestMapping("/api/outfits")
public class OutfitController {
    private final OutfitService outfitService;

    // Constructs an OutfitController with a dependency on the OutfitService
    public OutfitController(OutfitService outfitService) {
        this.outfitService = outfitService;
    }

    // Handles outfit retrieval requests by retrieving an outfit by its ID and returning a successful response
    @GetMapping("/{id}")
    public ResponseEntity<Outfit> getOutfitById(@PathVariable Long id) {
        Outfit outfit = outfitService.getOutfitById(id);
        return ResponseEntity.status(HttpStatus.OK).body(outfit);
    }

    // Handles outfit retrieval requests by retrieving all outfits for a specific user ID and returning a successful response
    @GetMapping("/user/{id}")
    public ResponseEntity<Iterable<Outfit>> getAllOutfitsByUserId(@PathVariable Long id) {
        Iterable<Outfit> outfits = outfitService.getAllOutfitsByUserId(id);
        return ResponseEntity.status(HttpStatus.OK).body(outfits);
    }

    // Handles outfit deletion requests by deleting an outfit by its ID and returning a successful response
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOutfitById(@PathVariable Long id) {
        outfitService.deleteOutfitById(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    // Handles outfit search requests by retrieving all outfits for a specific user ID and outfit name
    // ignoring case sensitivity, and returning a successful response
    @GetMapping("/user/{id}/search")
    public ResponseEntity<Iterable<Outfit>> searchOutfitsByUserAndOutfitName(@PathVariable Long id, @RequestParam String outfitName) {
        Iterable<Outfit> outfits = outfitService.searchOutfitsByUserAndOutfitName(id, outfitName);
        return ResponseEntity.status(HttpStatus.OK).body(outfits);
    }

    // Handles outfit report generation requests by generating a report for a user's outfits
    // and returning a successful response
    @GetMapping("/user/{id}/report")
    public ResponseEntity<OutfitResponseDto> generateOutfitReport(@PathVariable Long id) {
        OutfitResponseDto outfitResponseDtoReport = outfitService.getOutfitResponseDtoReport(id);
        return ResponseEntity.status(HttpStatus.OK).body(outfitResponseDtoReport);
    }
}
