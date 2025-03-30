package com.oussama.SocialMedia.post_service.controller;

import com.oussama.SocialMedia.post_service.entity.Post;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("api/v1/posts")
public class PostController {
    @GetMapping
    public ResponseEntity<Post> getAllPosts(){
        return null;
    }
    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post){
        return null;
    }
    @PutMapping
    @DeleteMapping
}
