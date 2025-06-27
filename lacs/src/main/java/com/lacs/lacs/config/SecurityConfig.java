package com.lacs.lacs.config;

import com.lacs.lacs.filter.JwtAuthenticationFilter;

import jakarta.servlet.Filter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthFilter;
        private final AuthenticationProvider authenticationProvider;
        private final PasswordEncoder passwordEncoder; // Asegúrate de que esta variable sea inyectada

        // Constructor para inyectar las dependencias
        public SecurityConfig(
                        JwtAuthenticationFilter jwtAuthFilter,
                        AuthenticationProvider authenticationProvider,
                        PasswordEncoder passwordEncoder // Inyecta PasswordEncoder
        ) {
                this.jwtAuthFilter = jwtAuthFilter;
                this.authenticationProvider = authenticationProvider;
                this.passwordEncoder = passwordEncoder; // Asigna PasswordEncoder
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .csrf(csrf -> csrf.disable()) // Deshabilita CSRF (Cross-Site Request Forgery) ya que
                                                              // estamos usando JWT
                                .authorizeHttpRequests(authorize -> authorize
                                                // Permite acceso sin autenticación a la ruta de autenticación (login,
                                                // registro)
                                                .requestMatchers("/api/auth/**").permitAll()
                                                // Cualquier otra solicitud requiere autenticación
                                                .anyRequest().authenticated())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authenticationProvider(authenticationProvider)
                                .addFilterBefore(jwtAuthFilter,
                                                (Class<? extends Filter>) UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }
}
