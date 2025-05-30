package com.oussama.SocialMedia.user_service.dto;

import com.oussama.SocialMedia.user_service.entity.Gender;
import lombok.*;
import org.springframework.lang.Nullable;

import java.net.URL;
import java.time.LocalDate;


@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserRequestDTO {


    private String username;

    private String firstname;

    private String lastname;

    private String about;

    private Long phone;

    private String email;


    private Gender gender;

   
    private LocalDate birthday;
}
