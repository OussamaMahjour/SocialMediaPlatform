package org.socialmedia.notificationservice.controller;


import lombok.AllArgsConstructor;
import org.socialmedia.notificationservice.entity.Notification;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@AllArgsConstructor
public class SocketController {

    private SimpMessagingTemplate messagingTemplate;
    @MessageMapping("/{username}/notify")
    public void notify(@DestinationVariable String username, @Payload Notification message) {
        messagingTemplate.convertAndSend("/topic/"+username, message);
    }


}
