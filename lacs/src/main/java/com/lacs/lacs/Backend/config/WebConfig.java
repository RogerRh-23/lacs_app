
package main.java.com.lacs.lacs.Backend.config; // ¡Asegúrate de que este paquete sea el correcto!

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration // Marca esta clase como una clase de configuración de Spring.
public class WebConfig implements WebMvcConfigurer {

    /**
     * Define las reglas CORS para la aplicación.
     * 
     * @param registry El registro de CORS donde se añaden las configuraciones.
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("http://127.0.0.1:3000/Frontend/login.html")
                // Aplica esta configuración CORS a todas las rutas (endpoints) de tu API.
                // Define los orígenes permitidos para realizar peticiones.
                // Es VITAL que aquí incluyas la URL completa de tu frontend.
                // Si usas "Live Server" en VS Code, comúnmente es http://127.0.0.1:5500 o
                // http://localhost:5500.
                // Asegúrate de que coincida con la URL que tu navegador muestra para tu
                // frontend.
                .allowedOrigins("http://127.0.0.1:5500", "http://localhost:5500", "http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Permite estos métodos HTTP.
                .allowedHeaders("*") // Permite todas las cabeceras en las peticiones.
                .allowCredentials(true); // Permite el envío de credenciales (como cookies o encabezados de
                                         // autenticación).
    }
}
