package com.oussama.SocialMedia.api_gateway.Dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequestDto {

    private String username;

    private String email;

    private String password;
}
