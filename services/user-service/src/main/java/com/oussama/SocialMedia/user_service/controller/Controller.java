package com.oussama.SocialMedia.user_service.controller;


import com.oussama.SocialMedia.user_service.dto.UserRequestDTO;
import com.oussama.SocialMedia.user_service.dto.UserResponseDTO;
import com.oussama.SocialMedia.user_service.service.ServiceInterface;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping(value = "/api/v1/users")
public class Controller {
    private ServiceInterface userService;

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> users = userService.getAllUsers();
        return new ResponseEntity<>(users,HttpStatusCode.valueOf(200));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(
                userService.getUserById(id)
        );
    }

    @PostMapping
    public ResponseEntity<UserResponseDTO> createUser(@RequestBody UserRequestDTO userRequestDTO) {

        return ResponseEntity.ok(
                userService.createUser(userRequestDTO)
        );
    }

    @PutMapping
    public ResponseEntity<UserResponseDTO> updateUser(@RequestBody UserRequestDTO userRequestDTO) {

        return ResponseEntity.ok(
            userService.updateUser(userRequestDTO)
                );
    }

    @DeleteMapping
    public ResponseEntity deleteUser(@RequestBody UserRequestDTO userRequestDTO) {
        userService.softDeleteUser(userRequestDTO);

        return ResponseEntity.ok().build();
    }

}
