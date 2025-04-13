package com.oussama.SocialMedia.post_service.Dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@Builder
@Getter
@Setter
public class MediaClientDto {
    private String context;
    private List<MultipartFile> medias;
}
