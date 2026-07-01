package com.SalinasEASWE.Holonode.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

// Base outfit entity with a primary key auto-incremented unique ID, many-to-one relationship with User,
// unnullable outfitName, description, unnullable bodyType, auto-created timestamp, auto-updated timestamp.
// The entity is also marked as abstract and with no clothing or color pieces to prevent direct instantiation and allows for future inheritance.
// There is also a method to get the equipment slots and color slots for the outfit for extended classes to implement.
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
public abstract class Outfit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String outfitName;

    private String outfitDescription;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime timestampCreated;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime timestampUpdated;

    @Column(nullable = false)
    private String bodyType;

    // Abstract method to get the equipment slots for the outfit and the color slots
    public abstract List<String> getEquipmentSlots();

    public abstract List<String> getColorSlots();

    // Getters and setters for Outfit entity fields
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

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

    public LocalDateTime getTimestampCreated() {
        return timestampCreated;
    }

    public LocalDateTime getTimestampUpdated() {
        return timestampUpdated;
    }

    public String getBodyType() {
        return bodyType;
    }

    public void setBodyType(String bodyType) {
        this.bodyType = bodyType;
    }

}
