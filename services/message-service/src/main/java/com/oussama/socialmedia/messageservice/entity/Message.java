package com.oussama.socialmedia.messageservice.entity;


import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(value = "Message")
public class Message {
    @Id
    private String id;
    private String content;
    private String chatId;
    private MessageType type;
    private String sender;
    @CreatedDate
    private LocalDateTime createdAt;
}
