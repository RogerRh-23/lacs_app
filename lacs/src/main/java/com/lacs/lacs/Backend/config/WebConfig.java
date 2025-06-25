// src/main/java/com/lacs/config/WebConfig.java
package com.lacs.lacs.Backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                        "http://127.0.0.1:3000", // ¡Este es el crucial que te da el error!
                        "http://localhost:3000", // Posiblemente una alternativa a 127.0.0.1
                        "http://127.0.0.1:5500", // Otros puertos comunes de Live Server
                        "http://localhost:5500", // Otros puertos comunes de Live Server
                        "http://localhost:8080" // Si alguna vez sirves el frontend desde el mismo backend
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
