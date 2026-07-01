package com.SalinasEASWE.Holonode.services;

import com.SalinasEASWE.Holonode.dto.OutfitDto;
import com.SalinasEASWE.Holonode.dto.OutfitResponseDto;
import com.SalinasEASWE.Holonode.entities.Outfit;
import com.SalinasEASWE.Holonode.entities.User;
import com.SalinasEASWE.Holonode.repositories.OutfitRepository;
import com.SalinasEASWE.Holonode.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

// Base outfit service for managing base outfits and CRUD operations
@Service
public class OutfitService {
    private final OutfitRepository outfitRepository;
    private final UserRepository userRepository;

    // Constructs an OutfitService with a dependency on the OutfitRepository
    public OutfitService(OutfitRepository outfitRepository, UserRepository userRepository) {
        this.outfitRepository = outfitRepository;
        this.userRepository = userRepository;
    }

    // Retrieves an outfit by its ID or throws an exception if not found
    public Outfit getOutfitById(Long id) {
        return outfitRepository.findById(id).orElseThrow(() -> new RuntimeException("Outfit not found"));
    }

    // Retrieves all outfits for a specific user ID from the database
    public List<Outfit> getAllOutfitsByUserId(Long id) {
        return outfitRepository.findAllByUserId(id);
    }

    // Updates an existing outfit by its ID and saves the changes to the database, or throws an exception if not found
    public Outfit updateOutfitById(Long id, OutfitDto outfitDto) {
        Outfit outfit = outfitRepository.findById(id).orElseThrow(() -> new RuntimeException("Outfit not found"));
        outfit.setOutfitName(outfitDto.getOutfitName());
        outfit.setOutfitDescription(outfitDto.getOutfitDescription());
        outfit.setBodyType(outfitDto.getBodyType());
        return outfitRepository.save(outfit);
    }

    // Deletes an outfit by its ID from the database
    public void deleteOutfitById(Long id) {
        outfitRepository.deleteById(id);
    }

    // Retrieves all outfits from the database based on the user ID and outfit name, ignoring case sensitivity for the search
    public List<Outfit> searchOutfitsByUserAndOutfitName(Long userId, String outfitName) {
        return outfitRepository.findAllByUserIdAndOutfitNameContainingIgnoreCase(userId, outfitName);
    }

    // Generates a report for a user's outfits with the username and creation timestamp, formatted as 'Outfit Report: username',
    // along with a list of all outfits for the user and their creation timestamp
    public OutfitResponseDto getOutfitResponseDtoReport(Long id) {
        OutfitResponseDto outfitResponseDtoReport = new OutfitResponseDto();
        outfitResponseDtoReport.setId(id);

        User user = userRepository.findById(id).orElseThrow(()-> new RuntimeException("User not found."));
        String username = user.getUsername();
        outfitResponseDtoReport.setUsername(username);

        outfitResponseDtoReport.setTitle("Outfit Report: " + username);

        List<Outfit> allOutfitsByUserId = getAllOutfitsByUserId(id);
        outfitResponseDtoReport.setOutfits(allOutfitsByUserId);

        LocalDateTime creationTimestamp = LocalDateTime.now();
        outfitResponseDtoReport.setCreationTimestamp(creationTimestamp);

        return outfitResponseDtoReport;
    }
}
