package com.oussama.SocialMedia.auth_service.authentication_service.Dto;


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
