package com.example.bibliotecapessoal.service;

import com.example.bibliotecapessoal.AbstractMongoIntegrationTest;
import com.example.bibliotecapessoal.model.Book;
import com.example.bibliotecapessoal.model.StatusLeitura;
import com.example.bibliotecapessoal.repository.BookRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

class BookServiceIntegrationTest extends AbstractMongoIntegrationTest {

    @Autowired
    private BookService bookService;

    @Autowired
    private BookRepository bookRepository;

    @AfterEach
    void cleanDatabase() {
        bookRepository.deleteAll();
    }

    @Test
    void createPersistsBookForUserInMongo() {
        Book book = new Book(
                "Clean Code",
                "Robert C. Martin",
                "Tecnologia",
                2008,
                "9780132350884",
                StatusLeitura.LENDO,
                null
        );

        Book savedBook = bookService.create(book, "user-1");

        assertThat(savedBook.getId()).isNotBlank();
        assertThat(bookRepository.findById(savedBook.getId()))
                .get()
                .satisfies(foundBook -> {
                    assertThat(foundBook.getTitulo()).isEqualTo("Clean Code");
                    assertThat(foundBook.getUserId()).isEqualTo("user-1");
                    assertThat(foundBook.getStatusLeitura()).isEqualTo(StatusLeitura.LENDO);
                });
    }

    @Test
    void findAndUpdateAreScopedByUserId() {
        Book userBook = bookService.create(new Book(
                "Domain-Driven Design",
                "Eric Evans",
                "Tecnologia",
                2003,
                "9780321125217",
                StatusLeitura.QUERO_LER,
                null
        ), "user-1");
        bookService.create(new Book(
                "Refactoring",
                "Martin Fowler",
                "Tecnologia",
                2018,
                "9780134757599",
                StatusLeitura.LIDO,
                null
        ), "user-2");

        List<Book> userBooks = bookService.findAllByUserId("user-1");
        Optional<Book> otherUserLookup = bookService.findByIdAndUserId(userBook.getId(), "user-2");

        assertThat(userBooks)
                .extracting(Book::getTitulo)
                .containsExactly("Domain-Driven Design");
        assertThat(otherUserLookup).isEmpty();

        Book updatedBook = new Book(
                "Domain-Driven Design",
                "Eric Evans",
                "Software",
                2003,
                "9780321125217",
                StatusLeitura.LIDO,
                null
        );

        Optional<Book> updateResult = bookService.update(userBook.getId(), updatedBook, "user-1");

        assertThat(updateResult).isPresent();

        assertThat(bookRepository.findByIdAndUserId(userBook.getId(), "user-1"))
                .get()
                .satisfies(foundBook -> {
                    assertThat(foundBook.getGenero()).isEqualTo("Software");
                    assertThat(foundBook.getStatusLeitura()).isEqualTo(StatusLeitura.LIDO);
                });
    }

    @Test
    void updateDoesNotChangeBookFromAnotherUser() {
        Book userBook = bookService.create(new Book(
                "Effective Java",
                "Joshua Bloch",
                "Tecnologia",
                2018,
                "9780134685991",
                StatusLeitura.QUERO_LER,
                null
        ), "user-1");

        Book updatedBook = new Book(
                "Effective Java",
                "Joshua Bloch",
                "Software",
                2018,
                "9780134685991",
                StatusLeitura.LIDO,
                null
        );

        Optional<Book> updateResult = bookService.update(userBook.getId(), updatedBook, "user-2");

        assertThat(updateResult).isEmpty();
        assertThat(bookRepository.findById(userBook.getId()))
                .get()
                .satisfies(foundBook -> {
                    assertThat(foundBook.getUserId()).isEqualTo("user-1");
                    assertThat(foundBook.getGenero()).isEqualTo("Tecnologia");
                    assertThat(foundBook.getStatusLeitura()).isEqualTo(StatusLeitura.QUERO_LER);
                });
    }

    @Test
    void deleteDoesNotRemoveBookFromAnotherUser() {
        Book userBook = bookService.create(new Book(
                "Patterns of Enterprise Application Architecture",
                "Martin Fowler",
                "Tecnologia",
                2002,
                "9780321127426",
                StatusLeitura.LENDO,
                null
        ), "user-1");

        boolean deletedByOtherUser = bookService.deleteByIdAndUserId(userBook.getId(), "user-2");
        boolean deletedByOwner = bookService.deleteByIdAndUserId(userBook.getId(), "user-1");

        assertThat(deletedByOtherUser).isFalse();
        assertThat(deletedByOwner).isTrue();
        assertThat(bookRepository.findById(userBook.getId())).isEmpty();
    }
}
