package com.example.bibliotecapessoal.service;

import com.example.bibliotecapessoal.model.Book;
import com.example.bibliotecapessoal.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public Book create(Book book) {
        return bookRepository.save(book);
    }

    public List<Book> findAll() {
        return bookRepository.findAll();
    }

    public Optional<Book> findById(String id) {
        return bookRepository.findById(id);
    }

    public List<Book> findByAuthor(String author) {
        return bookRepository.findByAuthorContainingIgnoreCase(author);
    }

    public Book update(String id, Book book) {
        book.setId(id);
        return bookRepository.save(book);
    }

    public void delete(String id) {
        bookRepository.deleteById(id);
    }
}
