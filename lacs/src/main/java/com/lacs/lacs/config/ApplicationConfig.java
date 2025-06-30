package com.lacs.lacs.config;

import com.lacs.lacs.auditing.ApplicationAuditAware;
import com.lacs.lacs.repository.UserRepository;
// import lombok.RequiredArgsConstructor; // Comentado porque el constructor es explícito
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Clase de configuración principal para la aplicación Spring Boot.
 * Define beans de seguridad, auditoría y CORS.
 */
@Configuration
// @RequiredArgsConstructor // Genera un constructor con todos los campos
// finales y no nulos inyectados
public class ApplicationConfig {

    // Inyección de dependencia del UserRepository para interactuar con los datos de
    // usuario
    private final UserRepository repository;

    /**
     * Constructor explícito para la inyección de UserRepository.
     * Esto asegura que el campo 'repository' se inicialice correctamente,
     * resolviendo el error "variable not initialized in the default constructor".
     * Spring se encargará de inyectar la instancia de UserRepository aquí.
     * 
     * @param repository La instancia de UserRepository inyectada por Spring.
     */
    public ApplicationConfig(UserRepository repository) {
        this.repository = repository;
    }

    /**
     * Define un bean UserDetailsService que se utiliza para cargar los detalles del
     * usuario
     * durante la autenticación. Busca un usuario por su nombre de usuario en el
     * repositorio.
     * 
     * @return una implementación de UserDetailsService
     */
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> repository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
    }

    /**
     * Configura el AuthenticationProvider, que es responsable de autenticar a los
     * usuarios.
     * Utiliza DaoAuthenticationProvider, que recupera los detalles del usuario de
     * un UserDetailsService
     * y verifica la contraseña utilizando un PasswordEncoder.
     * 
     * @return un AuthenticationProvider configurado
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService()); // Establece el servicio para cargar usuarios
        authProvider.setPasswordEncoder(passwordEncoder()); // Establece el codificador de contraseñas
        return authProvider;
    }

    /**
     * Define un bean AuditorAware que proporciona el ID del usuario actual para la
     * auditoría.
     * Es crucial para Spring Data JPA para rellenar automáticamente los campos
     * "createdBy" y "lastModifiedBy".
     * Ahora devuelve un Optional de tipo Long, ya que los IDs suelen ser Long.
     * 
     * @return una implementación de AuditorAware<Long>
     */
    @Bean
    public AuditorAware<Long> auditorAware() {
        return new ApplicationAuditAware();
    }

    /**
     * Expone el AuthenticationManager desde la configuración de Spring Security.
     * Este manager es el punto de entrada principal para el framework de
     * autenticación.
     * 
     * @param config la configuración de autenticación
     * @return el AuthenticationManager
     * @throws Exception si ocurre un error al obtener el manager
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * Define un bean PasswordEncoder para codificar y decodificar contraseñas.
     * Se recomienda BCryptPasswordEncoder por su seguridad y adaptabilidad.
     * 
     * @return una instancia de BCryptPasswordEncoder
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Configura las reglas de CORS (Cross-Origin Resource Sharing) para permitir
     * solicitudes desde orígenes específicos. Esto es esencial para que tu frontend
     * pueda comunicarse con tu backend si están en dominios/puertos diferentes.
     * 
     * @return una fuente de configuración CORS
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Orígenes permitidos (donde tu frontend estará corriendo)
        configuration.setAllowedOrigins(Arrays.asList(
                "http://127.0.0.1:3000", // Para desarrollo local con React/otros frameworks
                "http://localhost:3000", // Alternativa común para desarrollo local
                "http://127.0.0.1:5500", // Por si usas Live Server u otros
                "http://localhost:5500" // Alternativa para Live Server
        ));
        // Métodos HTTP permitidos
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // Cabeceras permitidas (se permiten todas en este caso)
        configuration.setAllowedHeaders(List.of("*"));
        // Permite el envío de credenciales (cookies, encabezados de autorización)
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Aplica esta configuración CORS a todas las rutas (/**)
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
