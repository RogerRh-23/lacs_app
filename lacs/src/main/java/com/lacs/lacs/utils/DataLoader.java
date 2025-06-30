package com.lacs.lacs.utils;

import com.lacs.lacs.model.User;
import com.lacs.lacs.model.Role;
import com.lacs.lacs.repository.UserRepository;

import java.util.HashMap;
import java.util.Map;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public DataLoader(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * @param args
     * @throws Exception
     */

    public void run(String... args) throws Exception {
        Map<String, String> adminCredentials = new HashMap<>();
        adminCredentials.put("rogerrh023@gmail.com", "#Roger_LACS_23");
        adminCredentials.put("framos@lacs.org.mx", "Lacs0102");

        for (Map.Entry<String, String> entry : adminCredentials.entrySet()) {
            String email = entry.getKey();
            String password = entry.getValue();

            if (userRepository.findByUsername(email.toLowerCase()).isEmpty()) {
                System.out.println("Creando usuario: " + email + "...");
                User adminUser = new User(
                        email.toLowerCase(),
                        passwordEncoder.encode(password),
                        extractFirstName(email),
                        extractLastName(email),
                        null,
                        email,
                        "LACS",
                        Role.ROLE_ADMIN);
                userRepository.save(adminUser);
                System.out.println("Usuario creado");
            } else {
                System.out.println("Usuario " + email + "ya existe");
            }
        }
    }

    private String extractFirstName(String email) {
        if (email == null || !email.contains("@"))
            return "Usuario";
        String localPart = email.split("@")[0];
        String[] parts = localPart.split("\\.");
        if (parts.length > 0) {
            return capitalizeFirstLetter(parts[0]);
        }
        return "Usuario";
    }

    private String extractLastName(String email) {
        if (email == null || !email.contains("@"))
            return "Admin";
        String localPart = email.split("@")[0];
        String[] parts = localPart.split("\\.");
        if (parts.length > 1) {
            return capitalizeFirstLetter(parts[1]);
        }
        return "Admin";
    }

    private String capitalizeFirstLetter(String str) {
        if (str == null || str.isEmpty())
            return str;
        return str.substring(0, 1) + str.substring(1);
    }
}
