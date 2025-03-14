package com.oussama.SocialMedia.user_service.client;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(path = "/api/v1/posts",url="http://post-service:8080",name = "post-service")
public interface PostClient {
    @DeleteMapping("/users/{id}")
    void deletePostsByUserId(@PathVariable("id") Long userId);

}
