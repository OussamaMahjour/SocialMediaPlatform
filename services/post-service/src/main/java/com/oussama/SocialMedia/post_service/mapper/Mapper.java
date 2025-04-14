package com.oussama.SocialMedia.post_service.mapper;

import com.oussama.SocialMedia.post_service.Dto.*;
import com.oussama.SocialMedia.post_service.entity.Comment;
import com.oussama.SocialMedia.post_service.entity.Post;
import com.oussama.SocialMedia.post_service.service.CommentService;
import com.oussama.SocialMedia.post_service.service.PostService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;


@Component
@AllArgsConstructor
public class Mapper {


    public Post PostCreationRequestDtoToPost(PostCreationRequest postCreationRequest) {
        return Post.builder()
                .reactions(0)
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
    public PostResponseDTO postToPostResponseDto(Post post){
        return PostResponseDTO.builder()
                .id(post.getId())
                .caption(post.getCaption())
                .media(post.getMedia())
                .reactions(post.getReactions())
                .username(post.getOwner())
                .build();
    }

    public Comment commentCreationRequestToComment(CommentCreationRequest comment){
        return Comment.builder()
                .author(comment.getAuthor())
                .content(comment.getContent())
                .post(comment.getPost())
                .build();
    }

    public CommentResponseDto commentToCommentResponseDto(Comment comment){
        return CommentResponseDto.builder()
                .post(comment.getPost())
                .id(comment.getId())
                .author(comment.getAuthor())
                .content(comment.getContent())
                .likes(comment.getLikes())
                .build();

    }




}
