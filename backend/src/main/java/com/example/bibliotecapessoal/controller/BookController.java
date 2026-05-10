package com.example.bibliotecapessoal.controller;

import com.example.bibliotecapessoal.dto.BookSearchResult;
import com.example.bibliotecapessoal.model.Book;
import com.example.bibliotecapessoal.model.User;
import com.example.bibliotecapessoal.service.BookService;
import com.example.bibliotecapessoal.service.ExternalBookService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class BookController {

    private final BookService bookService;
    private final ExternalBookService externalBookService;

    public BookController(BookService bookService, ExternalBookService externalBookService) {
        this.bookService = bookService;
        this.externalBookService = externalBookService;
    }

    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookService.findAllByUserId(user.getId()));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Book>> searchByAuthor(
            @RequestParam String author,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(bookService.findByAuthorAndUserId(author, user.getId()));
    }

    @GetMapping("/external-search")
    public ResponseEntity<List<BookSearchResult>> searchExternalBooks(@RequestParam String query) {
        return ResponseEntity.ok(externalBookService.search(query));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable String id, @AuthenticationPrincipal User user) {
        return bookService.findByIdAndUserId(id, user.getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Book> createBook(@Valid @RequestBody Book book, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookService.create(book, user.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(
            @PathVariable String id,
            @Valid @RequestBody Book book,
            @AuthenticationPrincipal User user
    ) {
        return bookService.update(id, book, user.getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable String id, @AuthenticationPrincipal User user) {
        if (bookService.deleteByIdAndUserId(id, user.getId())) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }
}
