package com.example.bibliotecapessoal.service;

import com.example.bibliotecapessoal.dto.AuthResponse;
import com.example.bibliotecapessoal.dto.LoginRequest;
import com.example.bibliotecapessoal.dto.RegisterRequest;
import com.example.bibliotecapessoal.dto.UserResponse;
import com.example.bibliotecapessoal.model.User;
import com.example.bibliotecapessoal.repository.UserRepository;
import com.example.bibliotecapessoal.security.JwtService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Locale;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public UserResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.email());

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email ja cadastrado.");
        }

        User user = new User(
                request.nome().trim(),
                email,
                passwordEncoder.encode(request.senha())
        );
        user.setCreatedAt(Instant.now());

        return UserResponse.from(userRepository.save(user));
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(normalizeEmail(request.email()))
                .orElseThrow(() -> new BadCredentialsException("Credenciais invalidas."));

        if (!passwordEncoder.matches(request.senha(), user.getPassword())) {
            throw new BadCredentialsException("Credenciais invalidas.");
        }

        return new AuthResponse(jwtService.generateToken(user), UserResponse.from(user));
    }

    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
