package com.oussama.socialmedia.mediaservice.service;

import com.oussama.socialmedia.mediaservice.config.MinioConfig;
import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MinioService {

    private final MinioClient minioClient;

    @Value("${minio.put-object-part-size}")
    private Long putObjectPartSize;

    public void save(MultipartFile file, String mediaId,String context) throws Exception {
        minioClient.putObject(
                PutObjectArgs
                        .builder()
                        .bucket(MinioConfig.BUCKET_NAME)
                        .object(context+"/"+mediaId)
                        .stream(file.getInputStream(), file.getSize(), putObjectPartSize)
                        .build()
        );
    }

    public InputStream getInputStream(String mediaId,String context, long offset, long length) throws Exception {
        return minioClient.getObject(
                GetObjectArgs
                        .builder()
                        .bucket(MinioConfig.BUCKET_NAME)
                        .offset(offset)
                        .length(length)
                        .object(context+"/"+mediaId)
                        .build());
    }

    public Resource getResource(String mediaId,String context) throws Exception {
        return new InputStreamResource(minioClient.getObject(
                GetObjectArgs.builder()
                        .bucket(MinioConfig.BUCKET_NAME)
                        .object(context+"/"+mediaId)
                        .build()
        ));
    }

}