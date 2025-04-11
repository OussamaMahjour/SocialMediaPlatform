package com.oussama.socialmedia.mediaservice.controller;


import com.oussama.socialmedia.mediaservice.dto.FileRequestDto;
import com.oussama.socialmedia.mediaservice.dto.MediaStaticResponse;
import com.oussama.socialmedia.mediaservice.dto.MediaStreamResponse;
import com.oussama.socialmedia.mediaservice.entity.Range;
import com.oussama.socialmedia.mediaservice.service.MediaServiceInterface;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

import static com.google.common.net.HttpHeaders.CONTENT_TYPE;

@Slf4j
@RestController
@RequestMapping("api/v1/media")

public class MediaController {
    @Autowired
    private  MediaServiceInterface mediaService;

    @Value("${media.streaming.default-chunk-size}")
    public Integer defaultChunkSize;
    @PostMapping
    public ResponseEntity<List<String>> saveMedias(@ModelAttribute FileRequestDto requestDto) {
            List<String> ids = new ArrayList<>();
            requestDto.getMedias().forEach(
                    media -> ids.add(mediaService.saveMedia(requestDto.getContext(), media))
            );
            return ResponseEntity.ok(ids);
    }
    @GetMapping("/{id}")
    public ResponseEntity getMedia(@PathVariable String id, HttpServletRequest request) {
        if(!mediaService.isMediaStreamable(id)){
            MediaStaticResponse mediaStaticResponse = mediaService.getStaticMedia(id);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(mediaStaticResponse.getHttpContentType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + mediaStaticResponse.getResource().getFilename() + "\"")
                    .body(mediaStaticResponse.getResource());
        }
        String range = request.getHeader(HttpHeaders.RANGE);
        Range parsedRange = Range.parseHttpRangeString(range,defaultChunkSize);
        MediaStreamResponse mediaStreamResponse = mediaService.fetchChunk(id, parsedRange);
        return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                .header(CONTENT_TYPE,mediaStreamResponse.getHttpContentType())
                .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                .header(
                        HttpHeaders.CONTENT_LENGTH,
                        String.valueOf(
                                parsedRange.getRangeEnd(mediaStreamResponse.getSize() - parsedRange.getStart() +1
                                )
                        )
                )
                .header(
                        HttpHeaders.CONTENT_RANGE,
                        "bytes "+parsedRange.getStart() +
                                "-" + parsedRange.getRangeEnd(mediaStreamResponse.getSize() )+
                                "/" + mediaStreamResponse.getSize()
                )
                .body(mediaStreamResponse.getChunk());



    }


    @DeleteMapping("/{id}")
    public ResponseEntity deleteMedia(@PathVariable String id) {
        mediaService.DeleteMediaById(id);
        return ResponseEntity.ok().build();
    }
    @DeleteMapping("/context/{context}")
    public ResponseEntity deleteContext(@PathVariable String context) {
        mediaService.DeleteContext(context);
        return ResponseEntity.ok().build();
    }

}
