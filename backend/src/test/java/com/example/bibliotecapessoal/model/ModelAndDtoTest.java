package com.example.bibliotecapessoal.model;

import com.example.bibliotecapessoal.dto.AuthResponse;
import com.example.bibliotecapessoal.dto.BookSearchResult;
import com.example.bibliotecapessoal.dto.LoginRequest;
import com.example.bibliotecapessoal.dto.MessageResponse;
import com.example.bibliotecapessoal.dto.RegisterRequest;
import com.example.bibliotecapessoal.dto.UserResponse;
import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;

class ModelAndDtoTest {

    @Test
    void userAccessorsExposeAssignedValues() {
        Instant createdAt = Instant.parse("2026-05-13T12:00:00Z");
        User user = new User("Maria", "maria@example.com", "password");

        user.setId("user-1");
        user.setNome("Maria Silva");
        user.setEmail("maria.silva@example.com");
        user.setPassword("encoded-password");
        user.setCreatedAt(createdAt);

        assertThat(user.getId()).isEqualTo("user-1");
        assertThat(user.getNome()).isEqualTo("Maria Silva");
        assertThat(user.getEmail()).isEqualTo("maria.silva@example.com");
        assertThat(user.getPassword()).isEqualTo("encoded-password");
        assertThat(user.getCreatedAt()).isEqualTo(createdAt);
    }

    @Test
    void bookAccessorsExposeAssignedValues() {
        Book book = new Book();

        book.setId("book-1");
        book.setTitulo("Clean Code");
        book.setAutor("Robert C. Martin");
        book.setGenero("Tecnologia");
        book.setAnoPublicacao(2008);
        book.setIsbn("9780132350884");
        book.setStatusLeitura(StatusLeitura.LIDO);
        book.setUserId("user-1");

        assertThat(book.getId()).isEqualTo("book-1");
        assertThat(book.getTitulo()).isEqualTo("Clean Code");
        assertThat(book.getAutor()).isEqualTo("Robert C. Martin");
        assertThat(book.getGenero()).isEqualTo("Tecnologia");
        assertThat(book.getAnoPublicacao()).isEqualTo(2008);
        assertThat(book.getIsbn()).isEqualTo("9780132350884");
        assertThat(book.getStatusLeitura()).isEqualTo(StatusLeitura.LIDO);
        assertThat(book.getUserId()).isEqualTo("user-1");
    }

    @Test
    void recordsAndEnumExposeValues() {
        User user = new User("Maria", "maria@example.com", "password");
        user.setId("user-1");
        UserResponse userResponse = UserResponse.from(user);

        assertThat(userResponse).isEqualTo(new UserResponse("user-1", "Maria", "maria@example.com"));
        assertThat(new AuthResponse("token", userResponse).token()).isEqualTo("token");
        assertThat(new LoginRequest("maria@example.com", "password").email()).isEqualTo("maria@example.com");
        assertThat(new RegisterRequest("Maria", "maria@example.com", "password123").senha()).isEqualTo("password123");
        assertThat(new MessageResponse("ok").message()).isEqualTo("ok");
        assertThat(new BookSearchResult("Titulo", "Autor", "Genero", 2020, "isbn", "LIDO").statusLeitura())
                .isEqualTo("LIDO");
        assertThat(StatusLeitura.values()).containsExactly(StatusLeitura.QUERO_LER, StatusLeitura.LENDO, StatusLeitura.LIDO);
    }
}
