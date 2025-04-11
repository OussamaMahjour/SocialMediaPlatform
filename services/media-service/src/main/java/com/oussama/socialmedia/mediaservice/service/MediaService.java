package com.oussama.socialmedia.mediaservice.service;


import com.oussama.socialmedia.mediaservice.dto.MediaStaticResponse;
import com.oussama.socialmedia.mediaservice.dto.MediaStreamResponse;
import com.oussama.socialmedia.mediaservice.entity.Media;
import com.oussama.socialmedia.mediaservice.entity.Range;
import com.oussama.socialmedia.mediaservice.repository.MediaRepository;
import io.minio.MinioClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Component
@Slf4j
public class MediaService implements MediaServiceInterface {

    @Value("${storage.root.path}")
    private String rootPath;

    @Autowired
    private MediaRepository mediaRepository;

    @Autowired
    private MinioService minioService;
    @Autowired
    private MinioClient minioClient;


    @Override
    @Transactional
    public String saveMedia(String context, MultipartFile multipartFile) {
        UUID id = UUID.randomUUID();
        try {
            String originalFilename = multipartFile.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf('.') + 1);
            }


            minioService.save(multipartFile,id.toString(),context);
            Media media = Media.builder()
                    .id(id.toString())
                    .context(context)
                    .path(rootPath +"/"+context+"/" + id+"." + extension)
                    .size(multipartFile.getSize())
                    .httpContentType(multipartFile.getContentType())
                    .build();


            mediaRepository.save(media);
            return media.getId();
        } catch (Exception ex) {
            throw new RuntimeException("Could not store file " + id + ". Please try again!", ex);
        }

    }

    @Override
    public MediaStaticResponse getStaticMedia(String mediaId) {
        Media media = mediaRepository.findById(mediaId).orElseThrow();
        try{
            return MediaStaticResponse.builder()
                    .resource(minioService.getResource(mediaId,media.getContext()))
                    .context(media.getContext())
                    .httpContentType(media.getHttpContentType())
                    .id(media.getId())
                    .build();


        } catch (Exception e) {
            throw new RuntimeException("Could not load image " + media.getId() + ". Please try again!", e);
        }

    }

    @Override
    @Transactional
    public void DeleteMediaById(String id) {
        Media media = mediaRepository.findById(id).orElse(null);
        mediaRepository.deleteById(id);
        if(media!=null){
                try {
                    Path path = Paths.get(media.getPath());
                    Files.delete(path);
                } catch (IOException e) {
                    throw new RuntimeException("Failed to delete file", e);
                }
        }
    }

    @Override
    @Transactional
    public void DeleteContext(String context) {
        List<Media> medias = mediaRepository.findAllByContext(context);
            medias.forEach(media -> {
                mediaRepository.deleteById(media.getId());
                Path path = Paths.get(media.getPath());
                try {
                    Files.delete(path);
                } catch (IOException e) {
                    throw new RuntimeException("Couldn't delete Media "+media.getId(),e);
                }
            });

            try {
            Path path = Paths.get(rootPath + "/" + context + "/");
            Files.delete(path);
        } catch (IOException e) {
            throw new RuntimeException("Couldn't delete context ",e);
        }
    }

    @Override
    public boolean isMediaStreamable(String mediaId){
            Media  media = mediaRepository.findById(mediaId).orElse(null);
            if(media !=null ){
                    return !media.getHttpContentType().startsWith("image");
            }else{
                throw  new RuntimeException("Coudn't detect media type if + "+mediaId);
            }
    }

    public MediaStreamResponse fetchChunk(String mediaId, Range range){
        Media media = mediaRepository.findById(mediaId).orElseThrow();
        long startPosition = range.getStart();
        long endPosition = range.getRangeEnd(media.getSize());
        int chunkSize = (int) (endPosition - startPosition + 1);
        try(InputStream inputStream = minioService.getInputStream(mediaId,media.getContext(),startPosition,chunkSize)){
                return MediaStreamResponse.builder()
                        .size(media.getSize())
                        .httpContentType(media.getHttpContentType())
                        .chunk(inputStream.readAllBytes())
                        .build();
        }catch (Exception exception) {
            log.error("Exception occurred when trying to read file with ID = {}", mediaId);
            throw new RuntimeException(exception);
        }

    }

}

