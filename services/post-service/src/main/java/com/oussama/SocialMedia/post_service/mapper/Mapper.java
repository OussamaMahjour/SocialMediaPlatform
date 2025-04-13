package com.oussama.SocialMedia.post_service.mapper;

import com.oussama.SocialMedia.post_service.Dto.PostCreationRequest;
import com.oussama.SocialMedia.post_service.Dto.PostRequestDto;
import com.oussama.SocialMedia.post_service.entity.Post;
import org.springframework.stereotype.Component;


@Component
public class Mapper {
    public Post PostCreationRequestDtoToPost(PostCreationRequest postCreationRequest) {
        return Post.builder()
                .likes(0)
                .owner(postCreationRequest.getUsername())
                .caption(postCreationRequest.getCaption())
                .build();
    }
    public Post PostToPostCreationRequestDto(Post post){
        return null;
    }

    public PostRequestDto postRequestDtoToPost(PostRequestDto post){
        return PostRequestDto.builder()
                .id(post.getId())
                .media(post.getMedia())
                .header(post.getHeader())
                .username(post.getUsername())
                .build();
    }




}
