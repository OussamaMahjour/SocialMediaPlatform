package com.oussama.SocialMedia.auth_service.authentication_service.service;


import com.oussama.SocialMedia.auth_service.authentication_service.Dto.RegisterUserDto;
import com.oussama.SocialMedia.auth_service.authentication_service.entity.User;
import com.oussama.SocialMedia.auth_service.authentication_service.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@AllArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public Mono<User> authenticate(String username, String password) {
        return userRepository.findByUsername(username)
                .flatMap(user -> passwordEncoder.matches(password, user.getPassword())
                        ? Mono.just(user)
                        : Mono.error(new BadCredentialsException("Invalid credentials")));
    }

    public Mono<User> signUp(RegisterUserDto registerUserDto) {
        User user = User.builder()
                .username(registerUserDto.getUsername())
                .password(passwordEncoder.encode(registerUserDto.getPassword()))
                .email(registerUserDto.getEmail())
                .build();
        return userRepository.save(user);
    }
}
