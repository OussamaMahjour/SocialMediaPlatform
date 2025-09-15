package org.socialmedia.notificationservice.entity;


import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

@Builder
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collation = "notification")
public  class Notification {
    @MongoId
    private String id;
    private  NotificationType type ;
}
