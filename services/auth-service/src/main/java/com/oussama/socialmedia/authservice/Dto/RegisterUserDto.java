package com.oussama.socialmedia.authservice.Dto;


import lombok.*;
import org.springframework.lang.Nullable;

import java.net.URL;
import java.time.LocalDate;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class RegisterUserDto {
    private String username;
    private String password;
    private Long phone;
    private String email;
}
