package com.oussama.SocialMedia.post_service.controller;

import com.oussama.SocialMedia.post_service.Dto.PostCreationRequest;
import com.oussama.SocialMedia.post_service.Dto.PostResponseDTO;
import com.oussama.SocialMedia.post_service.Dto.ReactionRequestDto;
import com.oussama.SocialMedia.post_service.entity.Post;
import com.oussama.SocialMedia.post_service.exception.PostNotFoundException;
import com.oussama.SocialMedia.post_service.exception.ReactionAlreadyMade;
import com.oussama.SocialMedia.post_service.exception.ReactionNotFoundException;
import com.oussama.SocialMedia.post_service.exception.UserNotFoundException;
import com.oussama.SocialMedia.post_service.service.PostService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


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

    @GetMapping("/{id}")
    public ResponseEntity<PostResponseDTO> getPostById(@PathVariable String id){

        try {
            return ResponseEntity.ok(postService.getPost(id));

        }catch (PostNotFoundException e){
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Post> deletePost(@PathVariable String id){
        try {
            postService.deletePost(id);
            return ResponseEntity.ok().build();
        }catch (PostNotFoundException e){
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/user/{username}")
    public ResponseEntity<Post> deletePostByUser(@PathVariable String username){
        try {
            postService.deleteByUser(username);
            return ResponseEntity.ok().build();
        }catch (UserNotFoundException e){
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<PostResponseDTO>> getPostByUser(@PathVariable String username){
        try{
            return ResponseEntity.ok(postService.getPostsByUser(username));
        }catch (UserNotFoundException e){
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/post/{id}/react")
    public ResponseEntity reactToPost(@PathVariable String id, @RequestBody ReactionRequestDto reactionRequestDto){
        try{
            postService.react(reactionRequestDto);
            return ResponseEntity.ok().build();
        }catch(ReactionAlreadyMade e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @DeleteMapping("/post/{id}/removeReaction")
    public ResponseEntity removeReactionToPost(@PathVariable String id, @RequestBody ReactionRequestDto reactionRequestDto){
        try{
            postService.removeReaction(reactionRequestDto);
            return ResponseEntity.ok().build();
        }catch(ReactionNotFoundException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


}
