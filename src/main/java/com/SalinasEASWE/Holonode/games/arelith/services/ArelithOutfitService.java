package com.SalinasEASWE.Holonode.games.arelith.services;

import com.SalinasEASWE.Holonode.entities.User;
import com.SalinasEASWE.Holonode.games.arelith.dto.ArelithOutfitDto;
import com.SalinasEASWE.Holonode.games.arelith.entities.ArelithOutfit;
import com.SalinasEASWE.Holonode.repositories.OutfitRepository;
import com.SalinasEASWE.Holonode.repositories.UserRepository;
import org.springframework.stereotype.Service;

// Extended Arelith service for handling Arelith outfit creation requests and saving them to the database
@Service
public class ArelithOutfitService {
    private final OutfitRepository outfitRepository;
    private final UserRepository userRepository;

    // Constructs an ArelithOutfitService with dependencies on OutfitRepository and UserRepository
    public ArelithOutfitService(OutfitRepository outfitRepository, UserRepository userRepository) {
        this.outfitRepository = outfitRepository;
        this.userRepository = userRepository;
    }

    // Creates a new Arelith outfit and saves it to the database with its detailed fields
    public ArelithOutfit createOutfit(ArelithOutfitDto arelithOutfitDto, Long userId) {
        ArelithOutfit arelithOutfit = new ArelithOutfit();
        arelithOutfit.setOutfitName(arelithOutfitDto.getOutfitName());
        arelithOutfit.setOutfitDescription(arelithOutfitDto.getOutfitDescription());
        arelithOutfit.setBodyType(arelithOutfitDto.getBodyType());

        arelithOutfit.setHelmet(arelithOutfitDto.getHelmet());
        arelithOutfit.setNeck(arelithOutfitDto.getNeck());
        arelithOutfit.setChest(arelithOutfitDto.getChest());
        arelithOutfit.setBelt(arelithOutfitDto.getBelt());
        arelithOutfit.setPelvis(arelithOutfitDto.getPelvis());
        arelithOutfit.setRobe(arelithOutfitDto.getRobe());
        arelithOutfit.setCloak(arelithOutfitDto.getCloak());
        arelithOutfit.setLeftShoulder(arelithOutfitDto.getLeftShoulder());
        arelithOutfit.setRightShoulder(arelithOutfitDto.getRightShoulder());
        arelithOutfit.setLeftBicep(arelithOutfitDto.getLeftBicep());
        arelithOutfit.setRightBicep(arelithOutfitDto.getRightBicep());
        arelithOutfit.setLeftForearm(arelithOutfitDto.getLeftForearm());
        arelithOutfit.setRightForearm(arelithOutfitDto.getRightForearm());
        arelithOutfit.setLeftHand(arelithOutfitDto.getLeftHand());
        arelithOutfit.setRightHand(arelithOutfitDto.getRightHand());
        arelithOutfit.setLeftThigh(arelithOutfitDto.getLeftThigh());
        arelithOutfit.setRightThigh(arelithOutfitDto.getRightThigh());
        arelithOutfit.setLeftShin(arelithOutfitDto.getLeftShin());
        arelithOutfit.setRightShin(arelithOutfitDto.getRightShin());
        arelithOutfit.setLeftFoot(arelithOutfitDto.getLeftFoot());
        arelithOutfit.setRightFoot(arelithOutfitDto.getRightFoot());

        arelithOutfit.setClothOneColor(arelithOutfitDto.getClothOneColor());
        arelithOutfit.setClothTwoColor(arelithOutfitDto.getClothTwoColor());
        arelithOutfit.setLeatherOneColor(arelithOutfitDto.getLeatherOneColor());
        arelithOutfit.setLeatherTwoColor(arelithOutfitDto.getLeatherTwoColor());
        arelithOutfit.setMetalOneColor(arelithOutfitDto.getMetalOneColor());
        arelithOutfit.setMetalTwoColor(arelithOutfitDto.getMetalTwoColor());

        // Links to the user who created the outfit
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        arelithOutfit.setUser(user);
        return outfitRepository.save(arelithOutfit);
    }

    // Updates an existing Arelith outfit by its ID and saves the changes to the database, or throws an exception if not found.
    public ArelithOutfit updateArelithOutfitById(Long id, ArelithOutfitDto arelithOutfitDto) {
        ArelithOutfit arelithOutfit = (ArelithOutfit)outfitRepository.findById(id).orElseThrow(() -> new RuntimeException("Arelith Outfit not found"));
        arelithOutfit.setOutfitName(arelithOutfitDto.getOutfitName());
        arelithOutfit.setOutfitDescription(arelithOutfitDto.getOutfitDescription());
        arelithOutfit.setBodyType(arelithOutfitDto.getBodyType());

        arelithOutfit.setHelmet(arelithOutfitDto.getHelmet());
        arelithOutfit.setNeck(arelithOutfitDto.getNeck());
        arelithOutfit.setChest(arelithOutfitDto.getChest());
        arelithOutfit.setBelt(arelithOutfitDto.getBelt());
        arelithOutfit.setPelvis(arelithOutfitDto.getPelvis());
        arelithOutfit.setRobe(arelithOutfitDto.getRobe());
        arelithOutfit.setCloak(arelithOutfitDto.getCloak());
        arelithOutfit.setLeftShoulder(arelithOutfitDto.getLeftShoulder());
        arelithOutfit.setRightShoulder(arelithOutfitDto.getRightShoulder());
        arelithOutfit.setLeftBicep(arelithOutfitDto.getLeftBicep());
        arelithOutfit.setRightBicep(arelithOutfitDto.getRightBicep());
        arelithOutfit.setLeftForearm(arelithOutfitDto.getLeftForearm());
        arelithOutfit.setRightForearm(arelithOutfitDto.getRightForearm());
        arelithOutfit.setLeftHand(arelithOutfitDto.getLeftHand());
        arelithOutfit.setRightHand(arelithOutfitDto.getRightHand());
        arelithOutfit.setLeftThigh(arelithOutfitDto.getLeftThigh());
        arelithOutfit.setRightThigh(arelithOutfitDto.getRightThigh());
        arelithOutfit.setLeftShin(arelithOutfitDto.getLeftShin());
        arelithOutfit.setRightShin(arelithOutfitDto.getRightShin());
        arelithOutfit.setLeftFoot(arelithOutfitDto.getLeftFoot());
        arelithOutfit.setRightFoot(arelithOutfitDto.getRightFoot());

        arelithOutfit.setClothOneColor(arelithOutfitDto.getClothOneColor());
        arelithOutfit.setClothTwoColor(arelithOutfitDto.getClothTwoColor());
        arelithOutfit.setLeatherOneColor(arelithOutfitDto.getLeatherOneColor());
        arelithOutfit.setLeatherTwoColor(arelithOutfitDto.getLeatherTwoColor());
        arelithOutfit.setMetalOneColor(arelithOutfitDto.getMetalOneColor());
        arelithOutfit.setMetalTwoColor(arelithOutfitDto.getMetalTwoColor());
        return outfitRepository.save(arelithOutfit);
    }
}
