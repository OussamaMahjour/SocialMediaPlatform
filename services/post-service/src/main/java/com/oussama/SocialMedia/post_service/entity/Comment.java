package com.oussama.SocialMedia.post_service.entity;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(value = "comments")
@Data
@Builder
public class Comment {
    @Id
    private String id;
    private String author;
    private String content;
    private String post;
    private long likes;
    @CreatedDate
    LocalDateTime createdAt;
}
