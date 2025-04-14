package com.oussama.SocialMedia.post_service.entity;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Builder
@Getter @Setter
@Document(value = "reaction")
public class Reaction {
    @Id
    private String id;
    private ReactionType type;
    private String context;
    private String author;
}
