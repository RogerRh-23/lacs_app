package com.lacs.lacs.controller;

import com.lacs.lacs.model.User;
import com.lacs.lacs.model.Role; // Importar la enumeración Role
import com.lacs.lacs.repository.UserRepository;
import com.lacs.lacs.dto.LoginRequest;
import com.lacs.lacs.dto.RegisterRequest;
import com.lacs.lacs.dto.AuthResponse;
import com.lacs.lacs.service.JwtService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    private String generateUniqueUsername(String firstName, String lastName, String company) {
        String firstInitial = "";
        if (firstName != null && !firstName.isEmpty()) {
            firstInitial = firstName.substring(0, 1).toLowerCase();
        }

        StringBuilder lastNameInitials = new StringBuilder();
        if (lastName != null && !lastName.isEmpty()) {
            String[] lastNameParts = lastName.split("\\s+");
            for (String part : lastNameParts) {
                if (!part.isEmpty()) {
                    lastNameInitials.append(part.substring(0, 1).toLowerCase());
                }
            }
        }

        String companyCleaned = "";
        if (company != null && !company.isEmpty()) {
            companyCleaned = company.toLowerCase().replaceAll("[^a-z0-9]", "");
        }

        String baseUsername = (firstInitial + lastNameInitials.toString() + companyCleaned).toLowerCase();

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
        String generatedUsername = generateUniqueUsername(registerRequest.getFirstName(), registerRequest.getLastName(),
                registerRequest.getCompany());

        String encodedPassword = passwordEncoder.encode(registerRequest.getPassword());

        User newUser = new User(
                generatedUsername,
                encodedPassword,
                registerRequest.getFirstName(),
                registerRequest.getLastName(),
                registerRequest.getPhone(),
                null,
                registerRequest.getCompany(),
                Role.ROLE_EMPLOYEE);

        userRepository.save(newUser);

        String token = jwtService.generateToken(generatedUsername);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AuthResponse("Usuario registrado exitosamente.", token, generatedUsername,
                        newUser.getRole().name()));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        String usernameToSearch = loginRequest.getUsername().toLowerCase();

        Optional<User> userOptional = userRepository.findByUsername(usernameToSearch);

        if (userOptional.isEmpty()) {
            System.out.println("Login attempt failed: Username '" + loginRequest.getUsername() + "' not found.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse("Credenciales inválidas.", null, null, null));
        }

        User user = userOptional.get();

        // 2. Verify the hashed password
        if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            System.out.println("Login successful for user: " + loginRequest.getUsername());

            String token = jwtService.generateToken(user.getUsername());

            return ResponseEntity.ok(
                    new AuthResponse("Inicio de sesión exitoso.", token, user.getUsername(), user.getRole().name()));
        } else {
            System.out.println(
                    "Login attempt failed: Incorrect password for username '" + loginRequest.getUsername() + "'.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse("Credenciales inválidas.", null, null, null));
        }
    }

    @GetMapping("/test-cors")
    public ResponseEntity<String> testCors() {
        return ResponseEntity.ok("CORS test successful!");
    }
}
