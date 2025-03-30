package com.oussama.SocialMedia.api_gateway.controller;


import com.oussama.SocialMedia.api_gateway.Dto.LoginRequestDto;
import com.oussama.SocialMedia.api_gateway.Dto.LoginResponseDto;
import com.oussama.SocialMedia.api_gateway.Dto.RegisterUserDto;
import com.oussama.SocialMedia.api_gateway.entity.User;
import com.oussama.SocialMedia.api_gateway.service.AuthService;
import com.oussama.SocialMedia.api_gateway.service.JwtService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@AllArgsConstructor
public class AuthController {
    private final JwtService jwtService;
    private final AuthService authService;
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginRequestDto) {

        User user  = authService.authenticate(loginRequestDto.getUsername(), loginRequestDto.getPassword());
        String token = jwtService.generateToken(user);
        LoginResponseDto loginResponseDto = LoginResponseDto
                .builder()
                .token(token)
                .expiresIn(System.currentTimeMillis()+jwtService.getExpirationTime())
                .build();

        return ResponseEntity.ok(loginResponseDto);

    }
    @PostMapping("/signup")
    public ResponseEntity<User> signup(@RequestBody  RegisterUserDto registerUserDto) {

        User user = authService.signUp(registerUserDto);

        return ResponseEntity.ok(user);


    }


}