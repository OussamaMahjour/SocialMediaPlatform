package com.oussama.socialmedia.messageservice.controller;


import com.oussama.socialmedia.messageservice.Dto.MessageRequestDto;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;

@org.springframework.stereotype.Controller
public class Controller {
    @MessageMapping("/send")
    @SendTo("/topic/chat")
    public String sendMessage(MessageRequestDto requestDto) {
        return "received";
    }


}
