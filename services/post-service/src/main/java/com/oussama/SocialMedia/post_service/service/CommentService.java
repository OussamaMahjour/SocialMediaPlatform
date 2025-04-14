package com.oussama.SocialMedia.post_service.service;

import com.oussama.SocialMedia.post_service.Dto.CommentCreationRequest;
import com.oussama.SocialMedia.post_service.Dto.CommentResponseDto;
import com.oussama.SocialMedia.post_service.entity.Comment;
import com.oussama.SocialMedia.post_service.exception.CommentNotFoundException;
import com.oussama.SocialMedia.post_service.exception.PostNotFoundException;
import com.oussama.SocialMedia.post_service.mapper.Mapper;
import com.oussama.SocialMedia.post_service.repository.CommentRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final Mapper mapper;

    public void createComment(CommentCreationRequest commentRequest) {
        commentRepository.save(mapper.commentCreationRequestToComment(commentRequest));
    }

    public CommentResponseDto getComment(String id) {
        Comment comment = commentRepository.findById(id).orElse(null);
        if(comment == null) throw new CommentNotFoundException(id);
        return mapper.commentToCommentResponseDto(comment);
    }

    public void deleteComment(String id) {
        if(commentRepository.findById(id).isPresent()) commentRepository.deleteById(id);
        else throw new CommentNotFoundException(id);
    }

    public void deleteCommentByPost(String postId) {
        if(!commentRepository.findAllByPost(postId).isEmpty()) commentRepository.deleteAllByPost(postId);
    }

    public List<CommentResponseDto> getCommentsByPost(String postId) {
        List<Comment> comments = commentRepository.findAllByPost(postId);
        return comments.stream().map(mapper::commentToCommentResponseDto).toList();
    }

}
