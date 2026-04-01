package com.example.demo.dto;

import com.example.demo.model.Role;
import com.example.demo.model.User;
import lombok.Data;

@Data
public class UserResponse {

    private String id;
    private String name;
    private String email;
    private Role role;

    public static UserResponse from(User user) {
        UserResponse dto = new UserResponse();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        return dto;
    }
}