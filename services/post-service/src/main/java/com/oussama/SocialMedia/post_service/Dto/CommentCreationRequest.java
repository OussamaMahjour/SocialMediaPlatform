package com.oussama.SocialMedia.post_service.Dto;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter @Setter
public class CommentCreationRequest {
    private String author;
    private String content;
    private String post;
}
