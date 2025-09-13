package org.socialmedia.notificationservice.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

@Builder
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collation = "notification")
public  class Notification {
    @Id
    private String id;
    private  NotificationType type ;
}
