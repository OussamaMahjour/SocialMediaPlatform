package org.socialmedia.notificationservice.service;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.socialmedia.notificationservice.entity.Notification;
import org.socialmedia.notificationservice.exception.InvalidNotificationFormat;
import org.socialmedia.notificationservice.repository.NotificationRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;


@Service
@AllArgsConstructor
public class NotificationService {
    private ObjectMapper objectMapper;
    private SimpMessagingTemplate messagingTemplate;
    private NotificationRepository notificationRepository;
    public void send(String payload,String  destination) {
        try {
            Notification notification = objectMapper.readValue(payload, Notification.class);
            System.out.println(notification);
            notification.setTimestamp(LocalDateTime.now());
            notificationRepository.save(notification);
            messagingTemplate.convertAndSend("/topic/"+destination, notification);
        }catch (JsonProcessingException e){
            throw new InvalidNotificationFormat();
        }

    }

}
