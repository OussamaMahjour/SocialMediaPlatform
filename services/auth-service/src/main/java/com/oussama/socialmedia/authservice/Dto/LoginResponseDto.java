package com.oussama.socialmedia.authservice.Dto;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Builder
@ToString
@Setter
@Getter
public class LoginResponseDto {
    private String token;
    private long expiresIn;
}
