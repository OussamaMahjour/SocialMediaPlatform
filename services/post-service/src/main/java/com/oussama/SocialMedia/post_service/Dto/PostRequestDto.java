package com.oussama.SocialMedia.post_service.DTO;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter @Setter
public class PostRequestDto {
    String id;
    String header;
    String[] media;
    String username;
}
