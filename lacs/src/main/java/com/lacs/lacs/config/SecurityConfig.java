package com.lacs.lacs.config;

import com.lacs.lacs.filter.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthFilter;
        private final AuthenticationProvider authenticationProvider;
        private final CorsConfigurationSource corsConfigurationSource;

        /**
         * @param jwtAuthFilter           El filtro JWT para la autenticación.
         * @param authenticationProvider  El proveedor de autenticación.
         * @param corsConfigurationSource La fuente de configuración CORS.
         */
        /*
         * public SecurityConfig(
         * JwtAuthenticationFilter jwtAuthFilter,
         * AuthenticationProvider authenticationProvider,
         * CorsConfigurationSource corsConfigurationSource
         * ) {
         * this.jwtAuthFilter = jwtAuthFilter;
         * this.authenticationProvider = authenticationProvider;
         * this.corsConfigurationSource = corsConfigurationSource;
         * }
         */

        /**
         * @param http
         * @return
         * @throws Exception
         */
        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .csrf(AbstractHttpConfigurer::disable)
                                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers("/api/auth/**").permitAll()
                                                .anyRequest().authenticated())
                                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authenticationProvider(authenticationProvider)
                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

                // Construye y devuelve la cadena de filtros de seguridad
                return http.build();
        }
}
