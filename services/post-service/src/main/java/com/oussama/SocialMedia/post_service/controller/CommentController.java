package com.oussama.SocialMedia.post_service.controller;

import com.oussama.SocialMedia.post_service.Dto.CommentCreationRequest;
import com.oussama.SocialMedia.post_service.Dto.CommentResponseDto;
import com.oussama.SocialMedia.post_service.exception.CommentNotFoundException;
import com.oussama.SocialMedia.post_service.service.CommentService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/comments")
@AllArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @PostMapping
    private ResponseEntity creatComment(@RequestBody CommentCreationRequest commentCreationRequest) {
        commentService.createComment(commentCreationRequest);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    private ResponseEntity<CommentResponseDto> getComment(@PathVariable String id) {
        try{
            return ResponseEntity.ok(commentService.getComment(id));
        }catch(CommentNotFoundException e){
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    private ResponseEntity deleteComment(@PathVariable String id) {
        try{
            commentService.deleteComment(id);
            return ResponseEntity.ok().build();
        }catch(CommentNotFoundException e){
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/post/{postId}")
    private ResponseEntity deleteCommentsByPost(@PathVariable String postId) {
        commentService.deleteCommentByPost(postId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/post/{postId}")
    private ResponseEntity getCommentsByPost(@PathVariable String postId) {
        commentService.getCommentsByPost(postId);
        return ResponseEntity.ok().build();
    }


}
