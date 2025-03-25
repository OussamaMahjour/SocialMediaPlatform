package com.oussama.SocialMedia.api_gateway.Dto;


import lombok.*;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class RegisterUserDto {
    private String username;
    private String email;
    private String password;
}
