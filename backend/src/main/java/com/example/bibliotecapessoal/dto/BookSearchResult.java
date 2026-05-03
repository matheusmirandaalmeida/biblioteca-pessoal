package com.example.bibliotecapessoal.dto;

public record BookSearchResult(
        String titulo,
        String autor,
        String genero,
        Integer anoPublicacao,
        String isbn,
        String statusLeitura
) {
}
