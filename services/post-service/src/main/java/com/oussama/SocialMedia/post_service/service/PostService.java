package com.oussama.SocialMedia.post_service.service;


import com.oussama.SocialMedia.post_service.Dto.MediaClientDto;
import com.oussama.SocialMedia.post_service.Dto.PostCreationRequest;
import com.oussama.SocialMedia.post_service.Dto.PostRequestDto;
import com.oussama.SocialMedia.post_service.client.MediaClient;
import com.oussama.SocialMedia.post_service.entity.Post;
import com.oussama.SocialMedia.post_service.mapper.Mapper;
import com.oussama.SocialMedia.post_service.repository.PostRepository;
import lombok.AllArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final Mapper mapper;
    private final MediaClient mediaClient;

    @Transactional
    public void creatPost(PostCreationRequest postCreationRequest) {
        Post  post = postRepository.save(mapper.PostCreationRequestDtoToPost(postCreationRequest));

            mediaClient.save(post.getId()
                            ,postCreationRequest.getMedia());
    }

    public void update(PostRequestDto postRequestDto) {
        //postRepository.save(mapper.postRequestDtoToPost(postRequestDto));
    }
}
