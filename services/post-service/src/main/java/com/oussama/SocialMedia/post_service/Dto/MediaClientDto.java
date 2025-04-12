package com.oussama.SocialMedia.post_service.DTO;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@Builder
@Getter
@Setter
public class MediaClientDto {
    private String post;
    private MultipartFile media;
}
