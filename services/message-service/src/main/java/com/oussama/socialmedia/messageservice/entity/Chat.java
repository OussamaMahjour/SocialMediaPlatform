package com.oussama.socialmedia.messageservice.entity;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;

public class Chat {
    @Id
    private String id;
    private String[] members;
    private ChatTypes type;
    @CreatedDate
    private LocalDateTime createdAt;
}
