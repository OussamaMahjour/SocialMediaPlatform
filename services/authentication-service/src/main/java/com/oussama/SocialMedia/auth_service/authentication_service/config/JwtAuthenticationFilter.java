package com.oussama.SocialMedia.auth_service.authentication_service.config;

import com.oussama.SocialMedia.auth_service.authentication_service.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextImpl;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.web.server.context.ServerSecurityContextRepository;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.io.IOException;

@Component
@AllArgsConstructor
public class JwtAuthenticationFilter implements WebFilter {
    private final JwtService jwtService;
    private final ReactiveUserDetailsService userDetailsService;


    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        final String authHeader = exchange.getRequest().getHeaders().getFirst("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")){
            return chain.filter(exchange);
        }

        final String token = authHeader.substring(7);
        return jwtService.getUserNameFromToken(token)
                .flatMap(username ->
                        userDetailsService.findByUsername(username)
                                .flatMap(userDetails ->
                                        jwtService.isTokenValid(token, userDetails)
                                                .filter(valid -> valid)
                                                .flatMap(valid -> {
                                                    UsernamePasswordAuthenticationToken authToken =
                                                            new UsernamePasswordAuthenticationToken(
                                                                    userDetails,
                                                                    null,
                                                                    userDetails.getAuthorities()
                                                            );
                                                    SecurityContext context = new SecurityContextImpl(authToken);
                                                    // Write the authentication into the reactive context.
                                                    return chain.filter(exchange)
                                                            .contextWrite(ReactiveSecurityContextHolder.withSecurityContext(Mono.just(context)));
                                                })
                                )
                )
                // If any step fails, just continue without authentication.
                .switchIfEmpty(chain.filter(exchange));
    }

}
