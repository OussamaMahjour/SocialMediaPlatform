package com.oussama.SocialMedia.post_service.service;


import com.oussama.SocialMedia.post_service.Dto.*;
import com.oussama.SocialMedia.post_service.client.MediaClient;
import com.oussama.SocialMedia.post_service.entity.Post;
import com.oussama.SocialMedia.post_service.entity.Reaction;
import com.oussama.SocialMedia.post_service.exception.PostNotFoundException;
import com.oussama.SocialMedia.post_service.exception.ReactionAlreadyMade;
import com.oussama.SocialMedia.post_service.exception.ReactionNotFoundException;
import com.oussama.SocialMedia.post_service.exception.UserNotFoundException;
import com.oussama.SocialMedia.post_service.mapper.Mapper;
import com.oussama.SocialMedia.post_service.repository.PostRepository;
import com.oussama.SocialMedia.post_service.repository.ReactionRepository;
import lombok.AllArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final Mapper mapper;
    private final MediaClient mediaClient;
    private final CommentService commentService;
    private final ReactionRepository reactionRepository;

    @Transactional
    public void creatPost(PostCreationRequest postCreationRequest) {
        String id = UUID.randomUUID().toString();
        Post  post = mapper.PostCreationRequestDtoToPost(postCreationRequest);
        post.setId(id);
        String[] media = mediaClient.save(id,postCreationRequest.getMedia());
        post.setMedia(media);
        postRepository.save(post);
    }

    public PostResponseDTO getPost(String id){
        List<CommentResponseDto> comments = commentService.getCommentsByPost(id);
        Post post = postRepository.findById(id).orElse(null);
        if(post == null)throw new PostNotFoundException(id);
        PostResponseDTO postResponseDTO = mapper.postToPostResponseDto(post);
        postResponseDTO.setComments(comments);
        return  postResponseDTO;
    }

    public void deletePost(String id){
        Post post = postRepository.findById(id).orElse(null);
        if(post == null)throw new PostNotFoundException(id);
        mediaClient.deleteByContext(post.getId());
        postRepository.delete(post);
    }

    public void deleteByUser(String username){
        List<Post> posts = postRepository.findAllByOwner(username);
        if(posts.isEmpty())throw new UserNotFoundException(username);
        posts.forEach(post -> mediaClient.deleteByContext(post.getId()));
        postRepository.deleteAllByOwner(username);
    }

    public List<PostResponseDTO> getPostsByUser(String username){
        List<Post> posts = postRepository.findAllByOwner(username);
        if(posts.isEmpty())throw new UserNotFoundException(username);
        return posts.stream().map(post->{
            PostResponseDTO postrespone =  mapper.postToPostResponseDto(post);
            postrespone.setComments(commentService.getCommentsByPost(post.getId()));
            return postrespone;
        }).toList();
    }

    public void react(ReactionRequestDto reaction){
        Reaction reactionEntity = reactionRepository.findReactionsByAuthorAndContext(reaction.getUsername(),reaction.getContext());
        if(reactionEntity == null){
            Post post = postRepository.findById(reaction.getContext()).orElse(null);
            if(post == null)throw new PostNotFoundException(reaction.getContext());
            post.setReactions(post.getReactions()+1);
            postRepository.save(post);
        }else{
            throw new ReactionAlreadyMade("Reaction to this Post has already been made");
        }

    }

    public void removeReaction(ReactionRequestDto reaction){
        Reaction reactionEntity = reactionRepository.findReactionsByAuthorAndContext(reaction.getUsername(),reaction.getContext());
        if(reactionEntity != null){
            Post post = postRepository.findById(reaction.getContext()).orElse(null);
            if(post == null)throw new PostNotFoundException(reaction.getContext());
            if(post.getReactions()>0){
                post.setReactions(post.getReactions()-1);
            }
            postRepository.save(post);
            reactionRepository.delete(reactionEntity);

        }else{
            throw new ReactionNotFoundException("Reaction Not Found for Context"+reaction.getContext());
        }
    }


}
