package com.example.bibliotecapessoal.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Nome e obrigatorio.")
        @Size(min = 2, max = 120, message = "Nome deve ter entre 2 e 120 caracteres.")
        String nome,

        @NotBlank(message = "Email e obrigatorio.")
        @Email(message = "Email invalido.")
        @Size(max = 160, message = "Email deve ter no maximo 160 caracteres.")
        String email,

        @NotBlank(message = "Senha e obrigatoria.")
        @Size(min = 8, max = 72, message = "Senha deve ter entre 8 e 72 caracteres.")
        String senha
) {
}
