package com.oussama.SocialMedia.post_service.DTO;


import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import javax.xml.transform.stream.StreamSource;
import java.time.LocalDateTime;
import java.util.List;


@Getter
@Setter
public class PostCreationRequestDTO {
    private String title;
    private String username;
    private List<MultipartFile> medias;
}
