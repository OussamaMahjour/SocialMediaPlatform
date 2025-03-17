package com.oussama.SocialMedia.auth_service.authentication_service.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${jwt.secretKey}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private Long jwtExpiration;

    public Mono<String> generateToken(UserDetails userDetails) {
        return generateToken(Map.of(), userDetails);
    }

    public Mono<String> generateToken(Map<String, Object> claims, UserDetails userDetails) {
        return Mono.fromCallable(() ->
                Jwts.builder()
                        .setClaims(claims)
                        .setSubject(userDetails.getUsername())
                        .setIssuedAt(new Date(System.currentTimeMillis()))
                        .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                        .signWith(getSigningKey())
                        .compact()
        );
    }

    public Mono<String> getUserNameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    public <T> Mono<T> getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        return Mono.fromCallable(() -> claimsResolver.apply(getClaimsFromToken(token)));
    }

    private Claims getClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public Mono<Boolean> isTokenValid(String token, UserDetails userDetails) {
        return getUserNameFromToken(token)
                .map(username -> username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public boolean isTokenExpired(String token) {
        return getClaimsFromToken(token).getExpiration().before(new Date());
    }

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey));
    }

    public long getExpirationTime() {
    return this.jwtExpiration;
    }
}
