package org.socialmedia.notificationservice.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;

import org.socialmedia.notificationservice.service.NotificationService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@AllArgsConstructor
public class SocketController {


    private NotificationService notificationService;
    @MessageMapping("/{username}/notify")
    public void notify(@DestinationVariable String username, @Payload String payload) throws Exception {
        notificationService.send(payload, username);
    }


}
