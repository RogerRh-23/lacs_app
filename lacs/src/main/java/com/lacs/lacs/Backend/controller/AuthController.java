package com.lacs.lacs.Backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Objeto de Transferencia de Datos (DTO) para la solicitud de inicio de sesión.
 * Spring mapeará automáticamente el JSON de entrada a una instancia de esta
 * clase.
 */
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
    private String token; // En una aplicación real, este sería un JWT para la autenticación

    /**
     * @param message Mensaje descriptivo del resultado del login.
     * @param token   Un token de autenticación (opcional, para una implementación
     *                real).
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

@RestController // Anotación que indica que esta clase es un controlador REST.
@RequestMapping("/api/auth") // Mapea todas las solicitudes que comienzan con /api/auth a este controlador.
public class AuthController {

    /**
     * Maneja las solicitudes POST al endpoint '/api/auth/login'.
     * Recibe los datos de usuario y contraseña en el cuerpo de la petición (JSON).
     * 
     * @param loginRequest Un objeto LoginRequest que contiene el nombre de usuario
     *                     y la contraseña.
     * @return ResponseEntity que contiene la respuesta (LoginResponse) y el estado
     *         HTTP.
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
            // Si el usuario y la contraseña coinciden con los valores predefinidos:
            String dummyToken = "jwt.token.generated.successfully"; // Simula un token JWT.
            // Retorna una respuesta HTTP 200 (OK) con el mensaje de éxito y el token.
            return ResponseEntity.ok(new LoginResponse("Inicio de sesión exitoso", dummyToken));
        } else {
            // Si las credenciales no coinciden:
            // Retorna una respuesta HTTP 401 (UNAUTHORIZED) con un mensaje de error.
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse("Credenciales inválidas", null));
        }
    }

    // Aquí se agregarían otros endpoints como @PostMapping("/register") para el
    // registro de usuarios, etc.
}
