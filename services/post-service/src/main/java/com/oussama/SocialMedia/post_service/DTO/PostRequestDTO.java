package com.oussama.SocialMedia.post_service.DTO;


import javax.xml.transform.stream.StreamSource;
import java.time.LocalDateTime;

public class PostRequestDTO {
    private String title;
    private String username;
    private LocalDateTime date;
    private CommentRequestDTO[] comments;
    private StreamSource[] medias;
}
