package com.example.bibliotecapessoal.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Document(collection = "books")
public class Book {

    @Id
    private String id;

    @NotBlank(message = "Titulo e obrigatorio.")
    @Size(max = 180, message = "Titulo deve ter no maximo 180 caracteres.")
    private String titulo;

    @NotBlank(message = "Autor e obrigatorio.")
    @Size(max = 140, message = "Autor deve ter no maximo 140 caracteres.")
    private String autor;

    @Size(max = 80, message = "Genero deve ter no maximo 80 caracteres.")
    private String genero;

    private Integer anoPublicacao;

    @Size(max = 30, message = "ISBN deve ter no maximo 30 caracteres.")
    private String isbn;

    private String statusLeitura = "QUERO_LER";

     private String userId;

    public Book() {
    }

    public Book(String titulo, String autor, String genero, Integer anoPublicacao, String isbn, String statusLeitura, String userId) {
        this.titulo = titulo;
        this.autor = autor;
        this.genero = genero;
        this.anoPublicacao = anoPublicacao;
        this.isbn = isbn;
        this.statusLeitura = statusLeitura;
        this.userId = userId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getAutor() {
        return autor;
    }

    public void setAutor(String autor) {
        this.autor = autor;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }

    public Integer getAnoPublicacao() {
        return anoPublicacao;
    }

    public void setAnoPublicacao(Integer anoPublicacao) {
        this.anoPublicacao = anoPublicacao;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public String getStatusLeitura() {
        return statusLeitura;
    }

    public void setStatusLeitura(String statusLeitura) {
        this.statusLeitura = statusLeitura;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
