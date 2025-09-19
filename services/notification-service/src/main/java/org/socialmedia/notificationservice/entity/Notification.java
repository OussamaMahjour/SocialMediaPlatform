package org.socialmedia.notificationservice.entity;


import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.*;
import org.socialmedia.notificationservice.entity.chat.ChatNotification;
import org.socialmedia.notificationservice.entity.chat.ChatNotificationType;
import org.socialmedia.notificationservice.entity.post.PostNotification;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDateTime;

@Builder
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collation = "notification")

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,      // use a logical name to identify subtype
        include = JsonTypeInfo.As.EXISTING_PROPERTY, // use existing field
        property = "type",               // field that decides the subtype
        visible = true                   // keep it in JSON even after deserialization
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = ChatNotification.class, name = "CHAT_NOTIFICATION"),
        @JsonSubTypes.Type(value = PostNotification.class, name = "POST_NOTIFICATION"),
})
public  class Notification {
    @MongoId
    private String id;
    private  NotificationType type ;
    @JsonProperty(required = true)
    private LocalDateTime timestamp;
}
