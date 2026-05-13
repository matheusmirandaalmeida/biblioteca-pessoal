package com.example.bibliotecapessoal.controller;

import com.example.bibliotecapessoal.AbstractMongoIntegrationTest;
import com.example.bibliotecapessoal.dto.LoginRequest;
import com.example.bibliotecapessoal.dto.RegisterRequest;
import com.example.bibliotecapessoal.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
class AuthControllerTest extends AbstractMongoIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @AfterEach
    void cleanDatabase() {
        userRepository.deleteAll();
    }

    @Test
    void registerPersistsAndReturnsCreatedUser() throws Exception {
        RegisterRequest request = new RegisterRequest("Maria", "Maria@Example.com", "password123");

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.nome").value("Maria"))
                .andExpect(jsonPath("$.email").value("maria@example.com"));

        assertThat(userRepository.findByEmail("maria@example.com")).isPresent();
    }

    @Test
    void loginReturnsAuthResponseForPersistedUser() throws Exception {
        register("Maria", "maria@example.com", "password123");

        LoginRequest request = new LoginRequest("maria@example.com", "password123");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.user.id").isNotEmpty())
                .andExpect(jsonPath("$.user.nome").value("Maria"))
                .andExpect(jsonPath("$.user.email").value("maria@example.com"));
    }

    @Test
    void meReturnsAuthenticatedUserFromJwt() throws Exception {
        String token = registerAndLogin("Maria", "maria@example.com", "password123");

        mockMvc.perform(get("/auth/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.nome").value("Maria"))
                .andExpect(jsonPath("$.email").value("maria@example.com"));
    }

    @Test
    void logoutReturnsSuccessMessageForAuthenticatedUser() throws Exception {
        String token = registerAndLogin("Maria", "maria@example.com", "password123");

        mockMvc.perform(post("/auth/logout")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Logout realizado com sucesso."));
    }

    private void register(String nome, String email, String senha) throws Exception {
        RegisterRequest request = new RegisterRequest(nome, email, senha);

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    private String registerAndLogin(String nome, String email, String senha) throws Exception {
        register(nome, email, senha);

        String loginResponse = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new LoginRequest(email, senha))))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode response = objectMapper.readTree(loginResponse);
        return response.get("token").asText();
    }
}
