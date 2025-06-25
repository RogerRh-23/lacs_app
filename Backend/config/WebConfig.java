package main.java.com.Backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuración CORS (Cross-Origin Resource Sharing) para la aplicación Spring
 * Boot.
 * Permite que el frontend (ejecutándose en un puerto diferente) pueda realizar
 * peticiones al backend.
 */
@Configuration // Indica que esta clase es una fuente de definiciones de beans de configuración
public class WebConfig implements WebMvcConfigurer {

    /**
     * Configura los mapeos CORS.
     * 
     * @param registry El registro de CORS para añadir reglas.
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Aplica la configuración CORS a todos los endpoints (/**)
                // Define los orígenes permitidos. Es crucial que aquí especifiques
                // la URL completa (protocolo, dominio y puerto) donde se ejecuta tu frontend.
                // Para desarrollo, http://127.0.0.1:5500 es común con Live Server.
                // Si usas localhost:5500 o tiene un subdirectorio, ajusta según sea necesario.
                .allowedOrigins("http://127.0.0.1:5500", "http://localhost:5500", "http://localhost:3000") // Agrega
                                                                                                           // todos los
                                                                                                           // orígenes
                                                                                                           // de tu
                                                                                                           // frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Permite estos métodos HTTP
                .allowedHeaders("*") // Permite todas las cabeceras en las peticiones
                .allowCredentials(true); // Permite el envío de cookies de credenciales (si las usas)
    }
}
