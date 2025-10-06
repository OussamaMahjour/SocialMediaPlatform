package org.master.chatservice.repository;

import org.master.chatservice.entity.Chat;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ChatRepository extends MongoRepository<Chat,String> {
    @Query("{ 'participants': { $all: ?0 } }")
    public Chat findByParticipants(List<String> participants);
    public Optional<List<Chat>> findByParticipantsContaining(String participant);
}
