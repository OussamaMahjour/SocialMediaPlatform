package org.socialmedia.notificationservice.entity.post;


import org.socialmedia.notificationservice.entity.Notification;
import org.socialmedia.notificationservice.entity.NotificationType;

public class PostNotification extends Notification {
    {
        super.setType(NotificationType.POST_NOTIFICATION);
    }



}
