package com.oussama.SocialMedia.post_service.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(value = "comments")
@Data
public class Comment {
    @Id
    private String id;
    private String author;
    private String text;
    private String post;

}
