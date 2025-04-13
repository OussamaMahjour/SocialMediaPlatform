package com.oussama.SocialMedia.post_service.entity;


import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;


@Document(value = "posts")
@Data
@Builder
public class Post {
    @Id
    String id;
    String caption;
    String owner;
    Integer likes;
    String[] media;
    @CreatedDate
    LocalDateTime createdAt;

}
