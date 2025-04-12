package com.oussama.socialmedia.gateway.config;

import com.oussama.socialmedia.gateway.filter.JWTAuthenticationFilter;
import lombok.AllArgsConstructor;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@AllArgsConstructor
public class Config {
    private JWTAuthenticationFilter filter;

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("user-service",r-> r.path("/api/v1/users/**")
                        .filters(f->f.filter(filter))
                        .uri("lb://user-service")
                )
                .route("auth-service",r -> r.path("/api/v1/auth/**")
                        .uri("lb://auth-service")
                )
                .route("media-service",r -> r.path("/api/v1/media/**")
                        .filters(f->f.filter(filter))
                        .uri("lb://media-service")
                )
                .build();
    }


}
