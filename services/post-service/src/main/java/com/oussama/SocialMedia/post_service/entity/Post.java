package com.oussama.SocialMedia.post_service.entity;


import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;


@Document(value = "posts")
@Data
public class Post {
    @Id
    String id;
    String title;
    Long user;
    Integer likes;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;

}
