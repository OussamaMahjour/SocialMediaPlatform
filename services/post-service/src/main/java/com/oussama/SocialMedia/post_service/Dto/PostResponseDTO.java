package com.oussama.SocialMedia.post_service.Dto;

import lombok.*;

import java.net.URI;
import java.util.List;


@Builder
@Getter
@Setter
public class PostResponseDTO {
    private String id;
    private String username;
    private String caption;
    private String[] media;
    private List<CommentResponseDto> comments;
    private long reactions;
}
