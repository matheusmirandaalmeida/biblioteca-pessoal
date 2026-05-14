package com.example.bibliotecapessoal.controller;

import com.example.bibliotecapessoal.AbstractMongoIntegrationTest;
import com.example.bibliotecapessoal.dto.LoginRequest;
import com.example.bibliotecapessoal.dto.RegisterRequest;
import com.example.bibliotecapessoal.model.StatusLeitura;
import com.example.bibliotecapessoal.repository.BookRepository;
import com.example.bibliotecapessoal.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Stream;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
class ValidationExceptionHandlerTest extends AbstractMongoIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @AfterEach
    void cleanDatabase() {
        bookRepository.deleteAll();
        userRepository.deleteAll();
    }

    @ParameterizedTest
    @MethodSource("invalidRegisterRequests")
    void registerReturnsBadRequestForInvalidPayload(Map<String, Object> payload, String expectedMessage)
            throws Exception {
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(expectedMessage));
    }

    @ParameterizedTest
    @MethodSource("invalidBookRequests")
    void createBookReturnsBadRequestForInvalidPayload(Map<String, Object> payload, String expectedMessage)
            throws Exception {
        mockMvc.perform(post("/api/books")
                        .header("Authorization", "Bearer " + registerAndLogin())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(expectedMessage));
    }

    @ParameterizedTest
    @MethodSource("invalidStatusRequests")
    void createBookReturnsBadRequestForInvalidStatus(String payload, String expectedMessage) throws Exception {
        mockMvc.perform(post("/api/books")
                        .header("Authorization", "Bearer " + registerAndLogin())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(expectedMessage));
    }

    private String registerAndLogin() throws Exception {
        String email = "user-" + System.nanoTime() + "@example.com";
        String senha = "password123";

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new RegisterRequest("User", email, senha))))
                .andExpect(status().isOk());

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

    private static Stream<Arguments> invalidRegisterRequests() {
        return Stream.of(
                Arguments.of(registerPayload(null, "user@example.com", "password123"), "Nome e obrigatorio."),
                Arguments.of(registerPayload("A", "user@example.com", "password123"), "Nome deve ter entre 2 e 120 caracteres."),
                Arguments.of(registerPayload("User", "", "password123"), "Email e obrigatorio."),
                Arguments.of(registerPayload("User", "invalid-email", "password123"), "Email invalido."),
                Arguments.of(registerPayload("User", "user@example.com", "short"), "Senha deve ter entre 8 e 72 caracteres.")
        );
    }

    private static Stream<Arguments> invalidBookRequests() {
        return Stream.of(
                Arguments.of(bookPayload("", "Autor", 2020, StatusLeitura.QUERO_LER), "Titulo e obrigatorio."),
                Arguments.of(bookPayload("Titulo", "", 2020, StatusLeitura.QUERO_LER), "Autor e obrigatorio."),
                Arguments.of(bookPayload("Titulo", "Autor", -1, StatusLeitura.QUERO_LER), "Ano de publicacao deve ser maior ou igual a 0."),
                Arguments.of(bookPayload("Titulo", "Autor", 2101, StatusLeitura.QUERO_LER), "Ano de publicacao deve ser menor ou igual a 2100."),
                Arguments.of(bookPayload("Titulo", "Autor", 2020, null), "Status de leitura e obrigatorio.")
        );
    }

    private static Stream<Arguments> invalidStatusRequests() {
        return Stream.of(
                Arguments.of("""
                        {
                            "titulo": "Titulo",
                            "autor": "Autor",
                            "anoPublicacao": 2020,
                            "statusLeitura": "INVALIDO"
                        }
                        """, "Status de leitura invalido.")
        );
    }

    private static Map<String, Object> registerPayload(String nome, String email, String senha) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("nome", nome);
        payload.put("email", email);
        payload.put("senha", senha);
        return payload;
    }

    private static Map<String, Object> bookPayload(String titulo, String autor, Integer anoPublicacao, StatusLeitura statusLeitura) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("titulo", titulo);
        payload.put("autor", autor);
        payload.put("genero", "Tecnologia");
        payload.put("anoPublicacao", anoPublicacao);
        payload.put("isbn", "9780132350884");
        payload.put("statusLeitura", statusLeitura);
        return payload;
    }
}
