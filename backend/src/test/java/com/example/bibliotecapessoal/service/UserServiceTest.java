package com.example.bibliotecapessoal.service;

import com.example.bibliotecapessoal.AbstractMongoIntegrationTest;
import com.example.bibliotecapessoal.dto.AuthResponse;
import com.example.bibliotecapessoal.dto.LoginRequest;
import com.example.bibliotecapessoal.dto.RegisterRequest;
import com.example.bibliotecapessoal.dto.UserResponse;
import com.example.bibliotecapessoal.model.User;
import com.example.bibliotecapessoal.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class UserServiceTest extends AbstractMongoIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserService userService;

    @AfterEach
    void cleanDatabase() {
        userRepository.deleteAll();
    }

    @Test
    void registerNormalizesEmailEncodesPasswordAndReturnsResponse() {
        RegisterRequest request = new RegisterRequest("  Maria Silva  ", " USER@Example.COM ", "password123");

        UserResponse response = userService.register(request);

        assertThat(response.nome()).isEqualTo("Maria Silva");
        assertThat(response.email()).isEqualTo("user@example.com");
        assertThat(response.id()).isNotBlank();

        User savedUser = userRepository.findByEmail("user@example.com").orElseThrow();
        assertThat(savedUser.getNome()).isEqualTo("Maria Silva");
        assertThat(savedUser.getEmail()).isEqualTo("user@example.com");
        assertThat(passwordEncoder.matches("password123", savedUser.getPassword())).isTrue();
        assertThat(savedUser.getCreatedAt()).isNotNull();
    }

    @Test
    void registerRejectsDuplicateEmail() {
        userService.register(new RegisterRequest("Maria", "user@example.com", "password123"));

        RegisterRequest duplicateRequest = new RegisterRequest("Maria", "USER@Example.COM", "password123");

        assertThatThrownBy(() -> userService.register(duplicateRequest))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Email ja cadastrado.");
    }

    @Test
    void loginReturnsTokenForValidCredentials() {
        UserResponse registeredUser = userService.register(
                new RegisterRequest("Maria", "user@example.com", "password123")
        );
        LoginRequest request = new LoginRequest(" USER@Example.COM ", "password123");

        AuthResponse response = userService.login(request);

        assertThat(response.token()).isNotBlank();
        assertThat(response.user()).isEqualTo(registeredUser);
    }

    @Test
    void loginRejectsUnknownEmail() {
        LoginRequest request = new LoginRequest("missing@example.com", "password123");

        assertThatThrownBy(() -> userService.login(request))
                .isInstanceOf(BadCredentialsException.class)
                .hasMessage("Credenciais invalidas.");
    }

    @Test
    void loginRejectsInvalidPassword() {
        userService.register(new RegisterRequest("Maria", "user@example.com", "password123"));
        LoginRequest request = new LoginRequest("user@example.com", "wrong-password");

        assertThatThrownBy(() -> userService.login(request))
                .isInstanceOf(BadCredentialsException.class)
                .hasMessage("Credenciais invalidas.");
    }

    @Test
    void findByIdReturnsUserFromRepository() {
        UserResponse registeredUser = userService.register(
                new RegisterRequest("Maria", "user@example.com", "password123")
        );

        assertThat(userService.findById(registeredUser.id()))
                .isPresent()
                .get()
                .extracting(User::getEmail)
                .isEqualTo("user@example.com");
    }
}
