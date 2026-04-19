package com.example.bibliotecapessoal.repository;

import com.example.bibliotecapessoal.model.Book;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends MongoRepository<Book, String> {
    List<Book> findByAuthorContainingIgnoreCase(String author);
}
