package com.oussama.socialmedia.authservice.config;


import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;


/**
 * Responsibilities:
 * - Configure authentication and authorization rules
 * - Register  JWT authentication filter
 * - Manage session stateless strategy for JWT
 * - Configure CORS rules for cross-origin requests
 */
@Configuration
@EnableWebSecurity
@AllArgsConstructor
public class SecurityConfig {

    // Custom AuthenticationProvider (configured in ApplicationConfig)
    private final AuthenticationProvider authenticationProvider;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;


    /**
     * Defines the main Spring Security filter chain.
     *
     * @param http HttpSecurity object for configuring security
     * @return a fully configured SecurityFilterChain
     * @throws Exception if configuration fails
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable) // Disable CSRF since JWT is not session-based auth
                .authorizeHttpRequests(req->
                        req
                                .requestMatchers("/api/v1/auth/**").permitAll() // public endpoints
                                .anyRequest().authenticated() // everything else requires authentication
                )
                .sessionManagement(session->session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Set session management to stateless (no HTTP sessions, JWT only)
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class); // Add JWT filter before the default UsernamePasswordAuthenticationFilter

        return http.build();
    }

    /**
     * Configures CORS (Cross-Origin Resource Sharing) settings.
     * @return CorsConfigurationSource with allowed origins, methods, and headers
     */
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:8080"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);// Apply configuration to all endpoints
        return source;

    }
}