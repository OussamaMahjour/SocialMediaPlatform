package com.oussama.socialmedia.authservice.exception;

public class InvalidCredentialException extends RuntimeException {
    public InvalidCredentialException(String message) {
        super(message);
    }
}
