package com.lacs.lacs.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lacs.lacs.model.User;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * 
     * @param username
     * @return
     */
    Optional<User> findByUsername(String username);

    /**
     * 
     * @param username
     * @return
     */
    boolean existsByUsername(String username);
}
