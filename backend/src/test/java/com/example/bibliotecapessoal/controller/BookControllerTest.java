package com.example.bibliotecapessoal.controller;

import com.example.bibliotecapessoal.AbstractMongoIntegrationTest;
import com.example.bibliotecapessoal.dto.LoginRequest;
import com.example.bibliotecapessoal.dto.RegisterRequest;
import com.example.bibliotecapessoal.model.Book;
import com.example.bibliotecapessoal.model.StatusLeitura;
import com.example.bibliotecapessoal.repository.BookRepository;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
class BookControllerTest extends AbstractMongoIntegrationTest {

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

    @Test
    void getAllBooksReturnsOnlyAuthenticatedUserBooks() throws Exception {
        AuthenticatedUser maria = registerAndLogin("Maria", "maria@example.com", "password123");
        AuthenticatedUser joao = registerAndLogin("Joao", "joao@example.com", "password123");
        bookRepository.save(book("Clean Code", "Robert C. Martin", maria.id()));
        bookRepository.save(book("Refactoring", "Martin Fowler", joao.id()));

        mockMvc.perform(get("/api/books")
                        .header("Authorization", maria.bearerToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].titulo").value("Clean Code"))
                .andExpect(jsonPath("$[0].userId").value(maria.id()))
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void searchByAuthorReturnsOnlyAuthenticatedUserBooks() throws Exception {
        AuthenticatedUser maria = registerAndLogin("Maria", "maria@example.com", "password123");
        AuthenticatedUser joao = registerAndLogin("Joao", "joao@example.com", "password123");
        bookRepository.save(book("Clean Code", "Robert C. Martin", maria.id()));
        bookRepository.save(book("Refactoring", "Martin Fowler", maria.id()));
        bookRepository.save(book("Patterns", "Martin Fowler", joao.id()));

        mockMvc.perform(get("/api/books/search")
                        .queryParam("author", "Martin Fowler")
                        .header("Authorization", maria.bearerToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].titulo").value("Refactoring"))
                .andExpect(jsonPath("$[0].userId").value(maria.id()))
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void getBookByIdReturnsBookOnlyForOwner() throws Exception {
        AuthenticatedUser maria = registerAndLogin("Maria", "maria@example.com", "password123");
        AuthenticatedUser joao = registerAndLogin("Joao", "joao@example.com", "password123");
        Book mariaBook = bookRepository.save(book("Clean Code", "Robert C. Martin", maria.id()));

        mockMvc.perform(get("/api/books/{id}", mariaBook.getId())
                        .header("Authorization", maria.bearerToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.titulo").value("Clean Code"))
                .andExpect(jsonPath("$.userId").value(maria.id()));

        mockMvc.perform(get("/api/books/{id}", mariaBook.getId())
                        .header("Authorization", joao.bearerToken()))
                .andExpect(status().isNotFound());
    }

    @Test
    void createBookPersistsBookForAuthenticatedUser() throws Exception {
        AuthenticatedUser maria = registerAndLogin("Maria", "maria@example.com", "password123");

        String response = mockMvc.perform(post("/api/books")
                        .header("Authorization", maria.bearerToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(book("Clean Code", "Robert C. Martin", null))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.titulo").value("Clean Code"))
                .andExpect(jsonPath("$.userId").value(maria.id()))
                .andReturn()
                .getResponse()
                .getContentAsString();

        String bookId = objectMapper.readTree(response).get("id").asText();
        assertThat(bookRepository.findByIdAndUserId(bookId, maria.id())).isPresent();
    }

    @Test
    void updateBookChangesOnlyOwnerBook() throws Exception {
        AuthenticatedUser maria = registerAndLogin("Maria", "maria@example.com", "password123");
        AuthenticatedUser joao = registerAndLogin("Joao", "joao@example.com", "password123");
        Book mariaBook = bookRepository.save(book("Clean Code", "Robert C. Martin", maria.id()));

        Book update = book("Clean Code Updated", "Robert C. Martin", null);
        update.setStatusLeitura(StatusLeitura.LIDO);

        mockMvc.perform(put("/api/books/{id}", mariaBook.getId())
                        .header("Authorization", maria.bearerToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(update)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.titulo").value("Clean Code Updated"))
                .andExpect(jsonPath("$.statusLeitura").value("LIDO"))
                .andExpect(jsonPath("$.userId").value(maria.id()));

        mockMvc.perform(put("/api/books/{id}", mariaBook.getId())
                        .header("Authorization", joao.bearerToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(update)))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteBookRemovesOnlyOwnerBook() throws Exception {
        AuthenticatedUser maria = registerAndLogin("Maria", "maria@example.com", "password123");
        AuthenticatedUser joao = registerAndLogin("Joao", "joao@example.com", "password123");
        Book mariaBook = bookRepository.save(book("Clean Code", "Robert C. Martin", maria.id()));

        mockMvc.perform(delete("/api/books/{id}", mariaBook.getId())
                        .header("Authorization", joao.bearerToken()))
                .andExpect(status().isNotFound());
        assertThat(bookRepository.findById(mariaBook.getId())).isPresent();

        mockMvc.perform(delete("/api/books/{id}", mariaBook.getId())
                        .header("Authorization", maria.bearerToken()))
                .andExpect(status().isNoContent());
        assertThat(bookRepository.findById(mariaBook.getId())).isEmpty();
    }

    private AuthenticatedUser registerAndLogin(String nome, String email, String senha) throws Exception {
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new RegisterRequest(nome, email, senha))))
                .andExpect(status().isOk());

        String loginResponse = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new LoginRequest(email, senha))))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode response = objectMapper.readTree(loginResponse);
        return new AuthenticatedUser(
                response.get("token").asText(),
                response.get("user").get("id").asText()
        );
    }

    private static Book book(String title, String author, String userId) {
        return new Book(title, author, "Tech", 2020, "isbn", StatusLeitura.QUERO_LER, userId);
    }

    private record AuthenticatedUser(String token, String id) {
        private String bearerToken() {
            return "Bearer " + token;
        }
    }
}
