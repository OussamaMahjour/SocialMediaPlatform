package com.oussama.SocialMedia.user_service.entity;



import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Builder
@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique=true) @NonNull
    private String username;
    @NonNull
    private String firstname;
    @NonNull
    private String lastname;
    private String about;
    private Long phone;
    @NonNull
    private String email;
    private String profilePictureId; // The id of the profile picture in the media service
    @NonNull
    @Enumerated(EnumType.STRING)
    private Gender gender;
    @NonNull
    private LocalDate birthdate;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private boolean deleted = false;
    private LocalDateTime deletedAt;

    @Version
    private Long version = 0L;

}
