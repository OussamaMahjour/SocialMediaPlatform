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
    private String firstname;
    private String lastname;
    private LocalDate birthdate;
    private Gender gender;
    private String username;
    private String password;
    private Long phone;
    private String email;
}
