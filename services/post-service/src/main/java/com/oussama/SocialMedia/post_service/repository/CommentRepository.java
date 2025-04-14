package com.oussama.SocialMedia.post_service.repository;

import com.oussama.SocialMedia.post_service.entity.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.Repository;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findAllByPost(String postId);

    void deleteAllByPost(String postId);
}
