package com.oussama.SocialMedia.post_service.client;


import com.oussama.SocialMedia.post_service.Dto.MediaClientDto;
import com.oussama.SocialMedia.post_service.config.FeignConfig;
import feign.Headers;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@FeignClient(name = "media-service",path = "/api/v1/media",configuration = FeignConfig.class)
public interface MediaClient {

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Headers("Content-Type: multipart/form-data")
    String[] save(@RequestPart(name = "context") String context, @RequestPart("medias") List<MultipartFile> medias);

    @DeleteMapping("/context/{context}")
    void deleteByContext(@PathVariable(name = "context") String context);
}
