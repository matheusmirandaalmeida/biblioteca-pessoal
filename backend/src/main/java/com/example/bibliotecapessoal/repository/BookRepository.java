package com.example.bibliotecapessoal.repository;

import com.example.bibliotecapessoal.model.Book;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends MongoRepository<Book, String> {
    List<Book> findByAutorContainingIgnoreCaseAndUserId(String autor, String userId);
    List<Book> findByGeneroContainingIgnoreCase(String genero);
    List<Book> findByStatusLeitura(String statusLeitura);
    List<Book> findByUserId(String userId);
    Optional<Book> findByIdAndUserId(String id, String userId);
}
