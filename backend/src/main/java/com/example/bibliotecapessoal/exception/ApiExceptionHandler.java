package com.example.bibliotecapessoal.exception;

import com.example.bibliotecapessoal.dto.MessageResponse;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<MessageResponse> handleValidation(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getDefaultMessage())
                .orElse("Dados invalidos.");

        return ResponseEntity.badRequest().body(new MessageResponse(message));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<MessageResponse> handleIllegalArgument(IllegalArgumentException exception) {
        return ResponseEntity.badRequest().body(new MessageResponse(exception.getMessage()));
    }

    @ExceptionHandler({BadCredentialsException.class})
    public ResponseEntity<MessageResponse> handleBadCredentials() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new MessageResponse("Email ou senha invalidos."));
    }

    @ExceptionHandler(DuplicateKeyException.class)
    public ResponseEntity<MessageResponse> handleDuplicateKey() {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new MessageResponse("Email ja cadastrado."));
    }
}
