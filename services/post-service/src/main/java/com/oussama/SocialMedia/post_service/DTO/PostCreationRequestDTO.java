package com.oussama.SocialMedia.post_service.DTO;


import javax.xml.transform.stream.StreamSource;
import java.time.LocalDateTime;

public class PostCreationRequestDTO {
    private String title;
    private String username;
    private LocalDateTime date;
    private StreamSource[] medias;
}
