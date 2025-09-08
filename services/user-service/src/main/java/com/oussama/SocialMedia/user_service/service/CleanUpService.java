package com.oussama.SocialMedia.user_service.service;


import com.oussama.SocialMedia.user_service.client.AuthClient;
import com.oussama.SocialMedia.user_service.entity.User;
import com.oussama.SocialMedia.user_service.repository.Repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.List;


@Service

public class CleanUpService {
    @Autowired
    private Repository userRepository;

    @Autowired
    private AuthClient authClient;

    @Value("${app.user.expireDuration}")
    private Integer expireDuration;


    @Scheduled(fixedRate = 30000)
    public void cleanUpExpiredUsers() {
        LocalDateTime cutoff = LocalDateTime.now().minusSeconds(expireDuration);
        List<User> expiredUsers = userRepository.findExpiredDeletions(cutoff);
        for(User user : expiredUsers) {
            deleteUserSafely(user);
        }

    }


    public void deleteUserSafely(User user) {
        try {
            userRepository.deleteById(user.getId());
            authClient.deleteUser(user.getUsername());
            System.out.println("Physically deleted user: " + user.getId());
        } catch (Exception e) {
            System.err.println("Delete conflict: " + e.getMessage());
        }
    }


}
