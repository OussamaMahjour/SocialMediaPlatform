package com.oussama.socialmedia.authservice.exception;

import com.oussama.socialmedia.authservice.Dto.Gender;
import lombok.*;

import java.time.LocalDate;


@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class RegisterException extends RuntimeException {
    private String firstname;
    private String lastname;
    private String birthdate;
    private String gender;
    private String username;
    private String password;
    private String phone;
    private String email;
}
