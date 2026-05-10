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

    public Book create(Book book, String userId) {
        book.setId(null);
        book.setUserId(userId);
        return bookRepository.save(book);
    }

    public List<Book> findAllByUserId(String userId) {
        return bookRepository.findByUserId(userId);
    }

    public Optional<Book> findByIdAndUserId(String id, String userId) {
        return bookRepository.findByIdAndUserId(id, userId);
    }

    public List<Book> findByAuthorAndUserId(String author, String userId) {
        return bookRepository.findByAutorContainingIgnoreCaseAndUserId(author, userId);
    }

    public Optional<Book> update(String id, Book book, String userId) {
        return bookRepository.findByIdAndUserId(id, userId)
                .map(existingBook -> {
                    book.setId(existingBook.getId());
                    book.setUserId(existingBook.getUserId());
                    return bookRepository.save(book);
                });
    }

    public boolean deleteByIdAndUserId(String id, String userId) {
        return bookRepository.findByIdAndUserId(id, userId)
                .map(book -> {
                    bookRepository.delete(book);
                    return true;
                })
                .orElse(false);
    }
}
