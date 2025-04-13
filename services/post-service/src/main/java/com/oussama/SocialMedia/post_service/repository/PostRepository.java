package com.oussama.SocialMedia.post_service.repository;

import com.oussama.SocialMedia.post_service.entity.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.Repository;

public interface PostRepository extends MongoRepository<Post, String> {
}

