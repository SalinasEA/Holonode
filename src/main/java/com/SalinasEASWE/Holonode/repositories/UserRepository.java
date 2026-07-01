package com.SalinasEASWE.Holonode.repositories;

import com.SalinasEASWE.Holonode.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

// User repository interface extending JpaRepository and adding a method to find a user by username
public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}
