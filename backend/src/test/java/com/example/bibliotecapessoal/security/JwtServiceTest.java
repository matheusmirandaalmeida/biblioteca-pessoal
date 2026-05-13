package com.example.bibliotecapessoal.security;

import com.example.bibliotecapessoal.model.User;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class JwtServiceTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void generateTokenAndExtractSubjectFromValidToken() {
        JwtService jwtService = new JwtService(objectMapper, "test-secret", 60);
        User user = user();

        String token = jwtService.generateToken(user);

        assertThat(token.split("\\.")).hasSize(3);
        assertThat(jwtService.extractSubject(token)).contains("user-1");
    }

    @Test
    void extractSubjectRejectsMalformedToken() {
        JwtService jwtService = new JwtService(objectMapper, "test-secret", 60);

        assertThat(jwtService.extractSubject("invalid-token")).isEmpty();
    }

    @Test
    void extractSubjectRejectsTamperedSignature() {
        JwtService jwtService = new JwtService(objectMapper, "test-secret", 60);
        String token = jwtService.generateToken(user());

        String tamperedToken = token.substring(0, token.lastIndexOf('.') + 1) + "invalid-signature";

        assertThat(jwtService.extractSubject(tamperedToken)).isEmpty();
    }

    @Test
    void extractSubjectRejectsExpiredToken() {
        JwtService jwtService = new JwtService(objectMapper, "test-secret", -1);
        String token = jwtService.generateToken(user());

        assertThat(jwtService.extractSubject(token)).isEmpty();
    }

    @Test
    void extractSubjectRejectsInvalidBase64Payload() {
        JwtService jwtService = new JwtService(objectMapper, "test-secret", 60);

        assertThat(jwtService.extractSubject("header.payload.signature")).isEmpty();
    }

    @Test
    void generateTokenWrapsJsonProcessingFailures() throws Exception {
        ObjectMapper failingObjectMapper = mock(ObjectMapper.class);
        when(failingObjectMapper.writeValueAsBytes(any()))
                .thenThrow(new JsonProcessingException("boom") {
                });
        JwtService jwtService = new JwtService(failingObjectMapper, "test-secret", 60);

        assertThatThrownBy(() -> jwtService.generateToken(user()))
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("Nao foi possivel gerar o token.");
    }

    private static User user() {
        User user = new User("Maria", "maria@example.com", "password");
        user.setId("user-1");
        return user;
    }
}
