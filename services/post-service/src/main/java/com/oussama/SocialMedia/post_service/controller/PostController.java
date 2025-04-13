package com.oussama.SocialMedia.post_service.controller;

import com.oussama.SocialMedia.post_service.Dto.PostCreationRequest;
import com.oussama.SocialMedia.post_service.entity.Post;
import com.oussama.SocialMedia.post_service.service.PostService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/posts")
@AllArgsConstructor
public class PostController {
    private final PostService postService;

    @GetMapping
    public ResponseEntity<Post> getAllPosts(){
        return null;
    }
    @PostMapping
    public ResponseEntity<Post> createPost(@ModelAttribute PostCreationRequest postCreationRequest){
        postService.creatPost(postCreationRequest);
        return ResponseEntity.ok().build();
    }

}
