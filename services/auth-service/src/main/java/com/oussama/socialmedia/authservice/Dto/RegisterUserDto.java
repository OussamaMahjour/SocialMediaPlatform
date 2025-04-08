package com.oussama.socialmedia.authservice.Dto;


import lombok.*;

import java.net.URL;
import java.time.LocalDate;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class RegisterUserDto {
    private String username;
    private String firstname;
    private String lastname;
    private String password;
    private String about;
    private Long phone;
    private String email;
    private URL profilePicture;
    private String gender;
    private LocalDate birthday;
}
