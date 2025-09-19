package org.socialmedia.notificationservice.entity.chat;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.socialmedia.notificationservice.entity.Notification;
import org.socialmedia.notificationservice.entity.NotificationType;


import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;



@AllArgsConstructor
@NoArgsConstructor
public class ChatNotification extends Notification {
    {
        super.setType(NotificationType.CHAT_NOTIFICATION);
    }
    @JsonProperty(required = true)
    private String senderUsername;
    @JsonProperty(required = true)
    private String recipientUsername;
    @JsonProperty(required = true)
    private ChatNotificationType MessageType;
    private String message;

}
