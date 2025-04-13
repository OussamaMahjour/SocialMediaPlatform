package com.oussama.SocialMedia.post_service.Dto;


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@Getter
@Setter
@ToString
public class PostCreationRequest {
    private String caption;
    private String username;
    private List<MultipartFile> media;
}
