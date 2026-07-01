package com.SalinasEASWE.Holonode.games.arelith.dto;

import jakarta.validation.constraints.Pattern;

// Extended outfit DTO for Arelith outfit creation. Includes clothing and equipment slots for Arelith outfits.
public class ArelithOutfitDto extends com.SalinasEASWE.Holonode.dto.OutfitDto {
    private String helmet;
    private String neck;
    private String chest;
    private String belt;
    private String pelvis;
    private String robe;
    private String cloak;
    private String leftShoulder;
    private String rightShoulder;
    private String leftBicep;
    private String rightBicep;
    private String leftForearm;
    private String rightForearm;
    private String leftHand;
    private String rightHand;
    private String leftThigh;
    private String rightThigh;
    private String leftShin;
    private String rightShin;
    private String leftFoot;
    private String rightFoot;

    // Color slots with validation for hex color code format
    @Pattern(regexp = "^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$", message = "Invalid color format. Please use a valid hex color code.")
    private String clothOneColor;

    @Pattern(regexp = "^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$", message = "Invalid color format. Please use a valid hex color code.")
    private String clothTwoColor;

    @Pattern(regexp = "^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$", message = "Invalid color format. Please use a valid hex color code.")
    private String leatherOneColor;

    @Pattern(regexp = "^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$", message = "Invalid color format. Please use a valid hex color code.")
    private String leatherTwoColor;

    @Pattern(regexp = "^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$", message = "Invalid color format. Please use a valid hex color code.")
    private String metalOneColor;

    @Pattern(regexp = "^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$", message = "Invalid color format. Please use a valid hex color code.")
    private String metalTwoColor;

    // Getters and setters for ArelithOutfitDto fields
    public String getHelmet() {
        return helmet;
    }

    public void setHelmet(String helmet) {
        this.helmet = helmet;
    }

    public String getNeck() {
        return neck;
    }

    public void setNeck(String neck) {
        this.neck = neck;
    }

    public String getChest() {
        return chest;
    }

    public void setChest(String chest) {
        this.chest = chest;
    }

    public String getBelt() {
        return belt;
    }

    public void setBelt(String belt) {
        this.belt = belt;
    }

    public String getPelvis() {
        return pelvis;
    }

    public void setPelvis(String pelvis) {
        this.pelvis = pelvis;
    }

    public String getRobe() {
        return robe;
    }

    public void setRobe(String robe) {
        this.robe = robe;
    }

    public String getCloak() {
        return cloak;
    }

    public void setCloak(String cloak) {
        this.cloak = cloak;
    }

    public String getLeftShoulder() {
        return leftShoulder;
    }

    public void setLeftShoulder(String leftShoulder) {
        this.leftShoulder = leftShoulder;
    }

    public String getRightShoulder() {
        return rightShoulder;
    }

    public void setRightShoulder(String rightShoulder) {
        this.rightShoulder = rightShoulder;
    }

    public String getLeftBicep() {
        return leftBicep;
    }

    public void setLeftBicep(String leftBicep) {
        this.leftBicep = leftBicep;
    }

    public String getRightBicep() {
        return rightBicep;
    }

    public void setRightBicep(String rightBicep) {
        this.rightBicep = rightBicep;
    }

    public String getLeftForearm() {
        return leftForearm;
    }

    public void setLeftForearm(String leftForearm) {
        this.leftForearm = leftForearm;
    }

    public String getRightForearm() {
        return rightForearm;
    }

    public void setRightForearm(String rightForearm) {
        this.rightForearm = rightForearm;
    }

    public String getLeftHand() {
        return leftHand;
    }

    public void setLeftHand(String leftHand) {
        this.leftHand = leftHand;
    }

    public String getRightHand() {
        return rightHand;
    }

    public void setRightHand(String rightHand) {
        this.rightHand = rightHand;
    }

    public String getLeftThigh() {
        return leftThigh;
    }

    public void setLeftThigh(String leftThigh) {
        this.leftThigh = leftThigh;
    }

    public String getRightThigh() {
        return rightThigh;
    }

    public void setRightThigh(String rightThigh) {
        this.rightThigh = rightThigh;
    }

    public String getLeftShin() {
        return leftShin;
    }

    public void setLeftShin(String leftShin) {
        this.leftShin = leftShin;
    }

    public String getRightShin() {
        return rightShin;
    }

    public void setRightShin(String rightShin) {
        this.rightShin = rightShin;
    }

    public String getLeftFoot() {
        return leftFoot;
    }

    public void setLeftFoot(String leftFoot) {
        this.leftFoot = leftFoot;
    }

    public String getRightFoot() {
        return rightFoot;
    }

    public void setRightFoot(String rightFoot) {
        this.rightFoot = rightFoot;
    }

    public String getClothOneColor() {
        return clothOneColor;
    }

    public void setClothOneColor(String clothOneColor) {
        this.clothOneColor = clothOneColor;
    }

    public String getClothTwoColor() {
        return clothTwoColor;
    }

    public void setClothTwoColor(String clothTwoColor) {
        this.clothTwoColor = clothTwoColor;
    }

    public String getLeatherOneColor() {
        return leatherOneColor;
    }

    public void setLeatherOneColor(String leatherOneColor) {
        this.leatherOneColor = leatherOneColor;
    }

    public String getLeatherTwoColor() {
        return leatherTwoColor;
    }

    public void setLeatherTwoColor(String leatherTwoColor) {
        this.leatherTwoColor = leatherTwoColor;
    }

    public String getMetalOneColor() {
        return metalOneColor;
    }

    public void setMetalOneColor(String metalOneColor) {
        this.metalOneColor = metalOneColor;
    }

    public String getMetalTwoColor() {
        return metalTwoColor;
    }

    public void setMetalTwoColor(String metalTwoColor) {
        this.metalTwoColor = metalTwoColor;
    }
}
