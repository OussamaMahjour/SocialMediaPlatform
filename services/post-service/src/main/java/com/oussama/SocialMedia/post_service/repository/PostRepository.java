package com.oussama.SocialMedia.post_service.repository;

import com.oussama.SocialMedia.post_service.entity.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.Repository;

import java.util.List;

public interface PostRepository extends MongoRepository<Post, String> {
    public void deleteAllByOwner(String owner);

    List<Post> findAllByOwner(String username);
}

