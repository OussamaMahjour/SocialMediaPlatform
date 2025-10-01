package com.oussama.SocialMedia.user_service.service;




import com.oussama.SocialMedia.user_service.client.MediaClient;
import com.oussama.SocialMedia.user_service.client.PostClient;
import com.oussama.SocialMedia.user_service.dto.FileRequestDTO;
import com.oussama.SocialMedia.user_service.dto.UserRequestDTO;
import com.oussama.SocialMedia.user_service.dto.UserResponseDTO;
import com.oussama.SocialMedia.user_service.entity.User;
import com.oussama.SocialMedia.user_service.exception.UserNotFoundException;
import com.oussama.SocialMedia.user_service.mapper.MapperInterface;
import com.oussama.SocialMedia.user_service.repository.Repository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;


import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.time.LocalDateTime;
@Component
@AllArgsConstructor
public class Service implements ServiceInterface {
    public Repository repository;
    public MapperInterface mapper;
    public MediaClient mediaClient;

    @Override
    public List<UserResponseDTO> getAllUsers() {
        return repository.findAll().stream().map(mapper::UserToUserResponseDTO).toList();
    }

    @Override
    public UserResponseDTO getUserById(Long id) {
        if(repository.findById(id).isEmpty())throw new UserNotFoundException("User not found with id "+ id);
        return mapper.UserToUserResponseDTO(repository.findById(id).get());
    }

    @Override
    public UserResponseDTO createUser(UserRequestDTO userRequestDTO) {
        User user = mapper.UserRequestDTOToUser(userRequestDTO);
        System.out.println(user);
        return mapper.UserToUserResponseDTO(repository.save(user));
    }

    @Override
    public UserResponseDTO updateUser(UserRequestDTO userRequestDTO) {
        User oldUser = repository.findUserByUsername(userRequestDTO.getUsername());
        if (oldUser == null) throw new UserNotFoundException("User not found with name "+ userRequestDTO.getUsername());
        User newUser = mapper.UserRequestDTOToUser(userRequestDTO);
        newUser.setId(oldUser.getId());
        newUser.setCreatedAt(oldUser.getCreatedAt());
        repository.save(newUser);
        return mapper.UserToUserResponseDTO(newUser);
    }


    @Override
    public void softDeleteUser(String username) {
        User user = repository.findUserByUsername(username);

        if(user ==  null) throw new UserNotFoundException("User not found with the following username: " + username );

        user.setDeleted(true);
        user.setDeletedAt(LocalDateTime.now());
        repository.save(user);


    }

    @Override
    public UserResponseDTO getUserByEmail(String email) {
        User user = repository.findUserByEmail(email);
        if(user ==  null) throw new UserNotFoundException("User not found with the following email " + email);
        return mapper.UserToUserResponseDTO(user);
    }

    @Override
    public UserResponseDTO getUserByUsername(String username) {
        User user = repository.findUserByUsername(username);
        if(user ==  null) throw new UserNotFoundException("User not found with the following username" + username);
        return mapper.UserToUserResponseDTO(user);
    }

    @Override
    public UserResponseDTO updateProfilePicture(String username, List<MultipartFile> files){
        User user = repository.findUserByUsername(username);
        if(user ==  null) throw new UserNotFoundException("User not found with the following username" + username);

        List<String> pfpId = mediaClient.saveMedia(
                FileRequestDTO.builder()
                        .medias(files)
                        .context("PROFILE").build()
        );

        user.setProfilePictureId(pfpId.get(0));
        repository.save(user);
        return mapper.UserToUserResponseDTO(user);

    }

    public List<UserResponseDTO> getUsersByPrefix(String prefix){
        if(prefix.isEmpty()){
            return new ArrayList<>();
        }
        List<User> users = repository.findByUsernameStartingWith(prefix);
        return users.stream().map(mapper::UserToUserResponseDTO).toList();
    }
}
