package com.lacs.lacs.service;

import com.lacs.lacs.config.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    // Inyecta la clase de propiedades JWT
    private final JwtProperties jwtProperties;

    // Constructor para inyectar JwtProperties
    public JwtService(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
    }

    // Método para extraer el nombre de usuario del token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Método genérico para extraer un "claim" del token
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Generar un token con detalles del usuario
    public String generateToken(String generatedUsername) {
        return generateToken(new HashMap<>(), generatedUsername);
    }

    // Generar un token con "extraClaims" y detalles del usuario
    public String generateToken(
            Map<String, ?> generatedUsername,
            String userDetails) {
        return Jwts
                .builder()
                .setClaims(generatedUsername)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                // Usa jwtProperties.getExpiration() para obtener el tiempo de expiración
                .setExpiration(new Date(System.currentTimeMillis() + jwtProperties.getExpiration()))
                // Usa jwtProperties.getSecretKey() para obtener la clave secreta
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Validar el token
    public boolean isTokenValid(String token, String userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    // Verificar si el token ha expirado
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Extraer la fecha de expiración del token
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Extraer todos los "claims" del token
    private Claims extractAllClaims(String token) {
        return Jwts
                .parser()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Obtener la clave de firma decodificada
    private Key getSignInKey() {
        // Usa jwtProperties.getSecretKey() para obtener la clave secreta
        byte[] keyBytes = Decoders.BASE64.decode(jwtProperties.getSecretKey());
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
