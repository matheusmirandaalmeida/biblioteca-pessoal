package com.example.bibliotecapessoal.dto;

import com.example.bibliotecapessoal.model.User;

public record UserResponse(String id, String nome, String email) {

    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getNome(), user.getEmail());
    }
}
