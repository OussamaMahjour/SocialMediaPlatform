package com.oussama.socialmedia.mediaservice.service;

import com.oussama.socialmedia.mediaservice.dto.MediaStaticResponse;
import com.oussama.socialmedia.mediaservice.dto.MediaStreamResponse;
import com.oussama.socialmedia.mediaservice.entity.Range;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface MediaServiceInterface {
    String saveMedia(String context, MultipartFile multipartFile);
    MediaStaticResponse getStaticMedia(String mediaId);
    void DeleteMediaById(String id);
    void DeleteContext(String context);
    boolean isMediaStreamable(String mediaId);
    MediaStreamResponse fetchChunk(String mediaId, Range range);

}
