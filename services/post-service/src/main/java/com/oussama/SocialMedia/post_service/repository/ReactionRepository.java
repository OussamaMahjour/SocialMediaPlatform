package com.oussama.SocialMedia.post_service.repository;

import com.oussama.SocialMedia.post_service.entity.Reaction;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ReactionRepository extends MongoRepository<Reaction, String> {
    public Reaction findReactionsByAuthorAndContext(String author, String context);
}
