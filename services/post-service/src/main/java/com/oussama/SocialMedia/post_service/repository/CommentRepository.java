package com.oussama.SocialMedia.post_service.repository;

import com.oussama.SocialMedia.post_service.entity.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.Repository;

public interface CommentRepository extends MongoRepository<Comment, Long> {
}
