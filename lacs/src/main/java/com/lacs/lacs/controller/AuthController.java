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

    @Autowired
    public AuthController(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // This method generates a unique username based on first name, last name, and
    // company.
    // It ensures the generated username is always in lowercase for consistency in
    // storage.
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

        // Combine initials and cleaned company name to form the base username, all in
        // lowercase.
        String baseUsername = (firstInitial + lastNameInitials.toString() + companyCleaned).toLowerCase();

        String username = baseUsername;
        int counter = 0;
        // Check for uniqueness. The stored username is always lowercase.
        while (userRepository.existsByUsername(username)) {
            counter++;
            username = baseUsername + counter;
        }
        return username;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest registerRequest) {
        // 1. Generate a unique username
        String generatedUsername = generateUniqueUsername(registerRequest.getFirstName(), registerRequest.getLastName(),
                registerRequest.getCompany());

        // 2. Encrypt the password
        String encodedPassword = passwordEncoder.encode(registerRequest.getPassword());

        // 3. Create a new User entity with default ROLE_EMPLOYEE
        User newUser = new User(
                generatedUsername, // Use the generated username
                encodedPassword,
                registerRequest.getFirstName(),
                registerRequest.getLastName(),
                registerRequest.getPhone(),
                null, // Email is null as it's not collected from the form
                registerRequest.getCompany(),
                Role.ROLE_EMPLOYEE // Assign default EMPLOYEE role
        );

        // 4. Save the new user to the database
        userRepository.save(newUser);

        // 5. Generate a JWT token for the newly registered user, including their role
        String token = jwtService.generateToken(generatedUsername, newUser.getRole().name());

        // 6. Return success response with the generated username, token, and role
        return ResponseEntity.status(HttpStatus.CREATED) // 201 Created
                .body(new AuthResponse("Usuario registrado exitosamente.", token, generatedUsername,
                        newUser.getRole().name()));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        // Convert the input username to lowercase before searching.
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

            // Generate a JWT token for the logged-in user, including their role
            String token = jwtService.generateToken(user.getUsername(), user.getRole().name());

            // Return success response with the token and user details
            return ResponseEntity.ok(
                    new AuthResponse("Inicio de sesión exitoso.", token, user.getUsername(), user.getRole().name()));
        } else {
            System.out.println(
                    "Login attempt failed: Incorrect password for username '" + loginRequest.getUsername() + "'.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse("Credenciales inválidas.", null, null, null));
        }
    }

    // Endpoint de prueba CORS
    @GetMapping("/test-cors")
    public ResponseEntity<String> testCors() {
        return ResponseEntity.ok("CORS test successful!");
    }
}
