package com.oussama.SocialMedia.post_service.exception;

public class ReactionAlreadyMade extends RuntimeException {
    public ReactionAlreadyMade(String message) {
        super(message);
    }
}
