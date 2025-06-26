package com.lacs.lacs.Backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

class LoginRequest {
    private String username;
    private String password;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

class LoginResponse {
    private String message;
    private String token;

    /**
     * @param message
     * @param token
     */
    public LoginResponse(String message, String token) {
        this.message = message;
        this.token = token;
    }

    public String getMessage() {
        return message;
    }

    public String getToken() {
        return token;
    }
}

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    /**
     * @param loginRequest
     * @return
     */
    @PostMapping("/login") // Mapea las solicitudes HTTP POST a la ruta /api/auth/login.
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // *** Lógica de Autenticación de Ejemplo (¡NO USAR EN PRODUCCIÓN!) ***
        // En una aplicación real, aquí deberías:
        // 1. Conectar con tu base de datos (H2/MySQL).
        // 2. Buscar al usuario por el username.
        // 3. Comparar la contraseña proporcionada con la contraseña encriptada
        // almacenada
        // (usando una librería de encriptación como BCryptPasswordEncoder).
        // 4. Si las credenciales son válidas, generar un token de sesión (ej. JWT) y
        // devolverlo.

        System.out.println("Intento de login para usuario: " + loginRequest.getUsername());

        // Ejemplo de validación simple:
        if ("admin".equals(loginRequest.getUsername()) && "password".equals(loginRequest.getPassword())) {
            String dummyToken = "jwt.token.generated.successfully";
            return ResponseEntity.ok(new LoginResponse("Inicio de sesión exitoso", dummyToken));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse("Credenciales inválidas", null));
        }
    }

    // Aquí se agregarían otros endpoints como @PostMapping("/register") para el
    // registro de usuarios, etc.
}
