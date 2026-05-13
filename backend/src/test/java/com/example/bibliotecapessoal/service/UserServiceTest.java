package com.example.bibliotecapessoal.service;

import com.example.bibliotecapessoal.dto.AuthResponse;
import com.example.bibliotecapessoal.dto.LoginRequest;
import com.example.bibliotecapessoal.dto.RegisterRequest;
import com.example.bibliotecapessoal.dto.UserResponse;
import com.example.bibliotecapessoal.model.User;
import com.example.bibliotecapessoal.repository.UserRepository;
import com.example.bibliotecapessoal.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private UserService userService;

    @Test
    void registerNormalizesEmailEncodesPasswordAndReturnsResponse() {
        RegisterRequest request = new RegisterRequest("  Maria Silva  ", " USER@Example.COM ", "password123");
        User savedUser = new User("Maria Silva", "user@example.com", "encoded-password");
        savedUser.setId("user-1");

        when(userRepository.existsByEmail("user@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        UserResponse response = userService.register(request);

        assertThat(response).isEqualTo(new UserResponse("user-1", "Maria Silva", "user@example.com"));

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        assertThat(userCaptor.getValue().getNome()).isEqualTo("Maria Silva");
        assertThat(userCaptor.getValue().getEmail()).isEqualTo("user@example.com");
        assertThat(userCaptor.getValue().getPassword()).isEqualTo("encoded-password");
        assertThat(userCaptor.getValue().getCreatedAt()).isNotNull();
    }

    @Test
    void registerRejectsDuplicateEmail() {
        RegisterRequest request = new RegisterRequest("Maria", "USER@Example.COM", "password123");
        when(userRepository.existsByEmail("user@example.com")).thenReturn(true);

        assertThatThrownBy(() -> userService.register(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Email ja cadastrado.");
    }

    @Test
    void loginReturnsTokenForValidCredentials() {
        LoginRequest request = new LoginRequest(" USER@Example.COM ", "password123");
        User user = new User("Maria", "user@example.com", "encoded-password");
        user.setId("user-1");

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "encoded-password")).thenReturn(true);
        when(jwtService.generateToken(user)).thenReturn("jwt-token");

        AuthResponse response = userService.login(request);

        assertThat(response.token()).isEqualTo("jwt-token");
        assertThat(response.user()).isEqualTo(new UserResponse("user-1", "Maria", "user@example.com"));
    }

    @Test
    void loginRejectsUnknownEmail() {
        LoginRequest request = new LoginRequest("missing@example.com", "password123");
        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.login(request))
                .isInstanceOf(BadCredentialsException.class)
                .hasMessage("Credenciais invalidas.");
    }

    @Test
    void loginRejectsInvalidPassword() {
        LoginRequest request = new LoginRequest("user@example.com", "wrong-password");
        User user = new User("Maria", "user@example.com", "encoded-password");

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong-password", "encoded-password")).thenReturn(false);

        assertThatThrownBy(() -> userService.login(request))
                .isInstanceOf(BadCredentialsException.class)
                .hasMessage("Credenciais invalidas.");
    }

    @Test
    void findByIdDelegatesToRepository() {
        User user = new User("Maria", "user@example.com", "encoded-password");
        when(userRepository.findById("user-1")).thenReturn(Optional.of(user));

        assertThat(userService.findById("user-1")).containsSame(user);
    }
}
