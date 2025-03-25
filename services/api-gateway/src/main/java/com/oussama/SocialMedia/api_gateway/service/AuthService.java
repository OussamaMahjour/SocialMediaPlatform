package com.oussama.SocialMedia.api_gateway.service;


import com.oussama.SocialMedia.api_gateway.Dto.RegisterUserDto;
import com.oussama.SocialMedia.api_gateway.entity.User;
import com.oussama.SocialMedia.api_gateway.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private AuthenticationManager authenticationManager;
    public User authenticate(String username, String password) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        return userRepository.findByUsername(username).orElseThrow();
    }

    public User signUp(RegisterUserDto registerUserDto) {

        User user = User.builder()
                .username(registerUserDto.getUsername())
                .password(passwordEncoder.encode(registerUserDto.getPassword()))
                .email(registerUserDto.getEmail())
                .build();
        return userRepository.save(user);
    }
}
