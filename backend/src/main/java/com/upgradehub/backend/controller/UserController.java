package com.upgradehub.backend.controller;

import com.upgradehub.backend.entity.User;
import com.upgradehub.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/create")
    public User createUser() {

        User user = User.builder()
                .email("test@test.com")
                .password("1234")
                .name("윤찬영")
                .build();

        return userRepository.save(user);
    }

    
}