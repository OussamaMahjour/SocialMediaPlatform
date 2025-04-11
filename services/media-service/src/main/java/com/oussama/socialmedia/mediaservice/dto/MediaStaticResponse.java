package com.oussama.socialmedia.mediaservice.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.core.io.Resource;

import java.io.InputStream;

@Builder
@Getter
@Setter
public class MediaStaticResponse {
    private String id;
    private String context;
    private String httpContentType;
    private Resource resource;
}