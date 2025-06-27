package com.lacs.lacs.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value; // Importar Value
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service // Marca esta clase como un componente de servicio de Spring
public class JwtService {

    // Se recomienda usar una clave secreta fuerte y gestionarla de forma segura
    // (ej. variables de entorno)
    // Por ahora, la cargamos desde application.properties.
    // ¡Añade esto en src/main/resources/application.properties si no lo tienes!
    // jwt.secret.key=TU_CLAVE_SECRETA_ALEATORIA_Y_LARGA_DE_AL_MENOS_256_BITS (ej.
    // una cadena Base64 generada)
    @Value("${jwt.secret.key}")
    private String SECRET_KEY;

    /**
     * Extrae el nombre de usuario (subject) del token JWT.
     * 
     * @param token El token JWT.
     * @return El nombre de usuario.
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extrae una "claim" específica del token JWT.
     * 
     * @param token          El token JWT.
     * @param claimsResolver Función para resolver la claim.
     * @param <T>            Tipo de la claim.
     * @return La claim extraída.
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Extrae todas las "claims" del token JWT.
     * 
     * @param token El token JWT.
     * @return Todas las claims.
     */
    private Claims extractAllClaims(String token) {
        // La sintaxis ha cambiado ligeramente en versiones recientes de JJWT.
        // `parser()` ahora devuelve directamente un builder.
        return Jwts
                .parser() // <--- CAMBIO CLAVE AQUÍ: usar .parser() directamente
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Valida si un token JWT es válido para un nombre de usuario dado.
     * 
     * @param token    El token JWT.
     * @param username El nombre de usuario al que se supone que pertenece el token.
     * @return true si el token es válido, false en caso contrario.
     */
    public boolean isTokenValid(String token, String username) {
        final String extractedUsername = extractUsername(token);
        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }

    /**
     * Verifica si el token JWT ha expirado.
     * 
     * @param token El token JWT.
     * @return true si el token ha expirado, false en caso contrario.
     */
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Extrae la fecha de expiración del token JWT.
     * 
     * @param token El token JWT.
     * @return La fecha de expiración.
     */
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Genera un token JWT para un nombre de usuario.
     * 
     * @param username El nombre de usuario (subject) del token.
     * @return El token JWT generado.
     */
    public String generateToken(String username) {
        return generateToken(new HashMap<>(), username);
    }

    /**
     * Genera un token JWT con claims adicionales y un nombre de usuario.
     * 
     * @param extraClaims Claims adicionales a incluir en el token.
     * @param username    El nombre de usuario (subject) del token.
     * @return El token JWT generado.
     */
    public String generateToken(Map<String, Object> extraClaims, String username) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(username) // El "subject" suele ser el identificador único del usuario
                .setIssuedAt(new Date(System.currentTimeMillis())) // Fecha de emisión
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // Expira en 24 horas
                .signWith(getSignInKey(), SignatureAlgorithm.HS256) // Firma el token con la clave y algoritmo
                .compact(); // Construye y compacta el token en su forma final
    }

    /**
     * Obtiene la clave de firma decodificada.
     * 
     * @return La clave secreta para la firma del JWT.
     */
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
