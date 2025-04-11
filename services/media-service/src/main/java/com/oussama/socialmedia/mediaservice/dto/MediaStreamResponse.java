package com.oussama.socialmedia.mediaservice.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.io.InputStream;

@Builder
@Getter
@Setter
public class MediaStreamResponse {
    private String id;
    private String context;
    private long size;
    private String httpContentType;
    private byte[] chunk;
}
