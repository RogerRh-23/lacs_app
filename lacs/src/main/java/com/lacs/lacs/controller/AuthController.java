// src/main/java/com/lacs/lacs/controller/AuthController.java
package com.lacs.lacs.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lacs.lacs.model.User;
import com.lacs.lacs.repository.UserRepository;
import com.lacs.lacs.dto.AuthResponse;
import com.lacs.lacs.dto.LoginRequest;
import com.lacs.lacs.dto.RegisterRequest;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public AuthController(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private String generateUniqueUsername(String firstName, String lastName) {
        String baseUsername = (firstName.toLowerCase().replaceAll("\\s", "") + "."
                + lastName.toLowerCase().replaceAll("\\s", ""));
        String username = baseUsername;
        int counter = 0;
        while (userRepository.existsByUsername(username)) {
            counter++;
            username = baseUsername + counter;
        }
        return username;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest registerRequest) {
        String generatedUsername = generateUniqueUsername(registerRequest.getFirstName(),
                registerRequest.getLastName());

        String encodedPassword = passwordEncoder.encode(registerRequest.getPassword());

        User newUser = new User(
                generatedUsername,
                encodedPassword,
                registerRequest.getFirstName(),
                registerRequest.getLastName(),
                registerRequest.getPhone(),
                null,
                registerRequest.getCompany());

        userRepository.save(newUser);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AuthResponse("Usuario registrado exitosamente.", null, generatedUsername));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        Optional<User> userOptional = userRepository.findByUsername(loginRequest.getUsername());

        if (userOptional.isEmpty()) {
            System.out.println("Login attempt failed: Username '" + loginRequest.getUsername() + "' not found.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse("Credenciales inválidas.", null, null));
        }

        User user = userOptional.get();

        if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            System.out.println("Login successful for user: " + loginRequest.getUsername());
            String dummyToken = "your_dummy_jwt_token_here_for_" + user.getUsername();
            return ResponseEntity.ok(new AuthResponse("Inicio de sesión exitoso.", dummyToken, user.getUsername()));
        } else {
            System.out.println(
                    "Login attempt failed: Incorrect password for username '" + loginRequest.getUsername() + "'.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse("Credenciales inválidas.", null, null));
        }
    }
}
