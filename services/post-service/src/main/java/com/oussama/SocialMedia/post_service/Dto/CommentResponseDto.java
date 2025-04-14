package com.oussama.SocialMedia.post_service.Dto;



import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;


@Builder
@Getter @Setter
public class CommentResponseDto {
    private String id;
    private String author;
    private String content;
    private String post;
    private long likes;
    LocalDateTime createdAt;
}
