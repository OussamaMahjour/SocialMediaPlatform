package com.oussama.SocialMedia.post_service.Dto;

import com.oussama.SocialMedia.post_service.entity.ReactionType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;


@Builder
@Getter @Setter
public class ReactionRequestDto {
    private String username;
    private String context;
    private ReactionType reactionType;

}
