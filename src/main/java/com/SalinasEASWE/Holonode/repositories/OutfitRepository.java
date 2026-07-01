package com.SalinasEASWE.Holonode.repositories;

import com.SalinasEASWE.Holonode.entities.Outfit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// Base outfit repository interface extending JpaRepository and adding a method to find all outfits by user ID
// and a method to find outfits by user ID and outfit name, ignoring case sensitivity
public interface OutfitRepository extends JpaRepository<Outfit, Long> {
    List<Outfit> findAllByUserId(Long userId);

    List<Outfit> findAllByUserIdAndOutfitNameContainingIgnoreCase(Long userId, String outfitName);
}
