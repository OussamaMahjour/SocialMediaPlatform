package org.socialmedia.notificationservice.entity.chat;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.socialmedia.notificationservice.entity.Notification;
import org.socialmedia.notificationservice.entity.NotificationType;

import java.time.LocalDateTime;



@AllArgsConstructor
@NoArgsConstructor
public class ChatNotification extends Notification {
    {
        super.setType(NotificationType.CHAT_NOTIFICATION);
    }
    private String senderUsername;
    private String recipientUsername;
    private ChatNotificationType MessageType;
    private String message;
    private LocalDateTime timestamp;
}
