package com.example.bibliotecapessoal.controller;

import com.example.bibliotecapessoal.dto.BookSearchResult;
import com.example.bibliotecapessoal.model.Book;
import com.example.bibliotecapessoal.service.BookService;
import com.example.bibliotecapessoal.service.ExternalBookService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<List<Book>> getAllBooks() {
        return ResponseEntity.ok(bookService.findAll());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Book>> searchByAuthor(@RequestParam String author) {
        return ResponseEntity.ok(bookService.findByAuthor(author));
    }

    @GetMapping("/external-search")
    public ResponseEntity<List<BookSearchResult>> searchExternalBooks(@RequestParam String query) {
        return ResponseEntity.ok(externalBookService.search(query));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable String id) {
        return bookService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Book> createBook(@Valid @RequestBody Book book) {
        return ResponseEntity.ok(bookService.create(book));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable String id, @Valid @RequestBody Book book) {
        return bookService.findById(id)
                .map(existing -> ResponseEntity.ok(bookService.update(id, book)))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable String id) {
        return bookService.findById(id)
                .map(existing -> {
                    bookService.delete(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
