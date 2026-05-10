package com.example.bibliotecapessoal.controller;

import com.example.bibliotecapessoal.exception.ApiExceptionHandler;
import com.example.bibliotecapessoal.model.StatusLeitura;
import com.example.bibliotecapessoal.model.User;
import com.example.bibliotecapessoal.service.BookService;
import com.example.bibliotecapessoal.service.ExternalBookService;
import com.example.bibliotecapessoal.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Stream;

import static org.mockito.Mockito.mock;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class ValidationExceptionHandlerTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    private MockMvc authMockMvc;
    private MockMvc bookMockMvc;

    @BeforeEach
    void setUp() {
        LocalValidatorFactoryBean validator = new LocalValidatorFactoryBean();
        validator.afterPropertiesSet();

        authMockMvc = MockMvcBuilders.standaloneSetup(new AuthController(mock(UserService.class)))
                .setControllerAdvice(new ApiExceptionHandler())
                .setMessageConverters(new MappingJackson2HttpMessageConverter(objectMapper))
                .setValidator(validator)
                .build();

        bookMockMvc = MockMvcBuilders.standaloneSetup(new BookController(
                        mock(BookService.class),
                        mock(ExternalBookService.class)
                ))
                .setControllerAdvice(new ApiExceptionHandler())
                .setCustomArgumentResolvers(new AuthenticatedUserArgumentResolver())
                .setMessageConverters(new MappingJackson2HttpMessageConverter(objectMapper))
                .setValidator(validator)
                .build();
    }

    @ParameterizedTest
    @MethodSource("invalidRegisterRequests")
    void registerReturnsBadRequestForInvalidPayload(Map<String, Object> payload, String expectedMessage)
            throws Exception {
        authMockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(expectedMessage));
    }

    @ParameterizedTest
    @MethodSource("invalidBookRequests")
    void createBookReturnsBadRequestForInvalidPayload(Map<String, Object> payload, String expectedMessage)
            throws Exception {
        bookMockMvc.perform(post("/api/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(expectedMessage));
    }

    @ParameterizedTest
    @MethodSource("invalidStatusRequests")
    void createBookReturnsBadRequestForInvalidStatus(String payload, String expectedMessage) throws Exception {
        bookMockMvc.perform(post("/api/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(expectedMessage));
    }

    private static Stream<Arguments> invalidRegisterRequests() {
        return Stream.of(
                Arguments.of(registerPayload(null, "user@example.com", "password123"), "Nome e obrigatorio."),
                Arguments.of(registerPayload("A", "user@example.com", "password123"), "Nome deve ter entre 2 e 120 caracteres."),
                Arguments.of(registerPayload("User", "", "password123"), "Email e obrigatorio."),
                Arguments.of(registerPayload("User", "invalid-email", "password123"), "Email invalido."),
                Arguments.of(registerPayload("User", "user@example.com", "short"), "Senha deve ter entre 8 e 72 caracteres.")
        );
    }

    private static Stream<Arguments> invalidBookRequests() {
        return Stream.of(
                Arguments.of(bookPayload("", "Autor", 2020, StatusLeitura.QUERO_LER), "Titulo e obrigatorio."),
                Arguments.of(bookPayload("Titulo", "", 2020, StatusLeitura.QUERO_LER), "Autor e obrigatorio."),
                Arguments.of(bookPayload("Titulo", "Autor", -1, StatusLeitura.QUERO_LER), "Ano de publicacao deve ser maior ou igual a 0."),
                Arguments.of(bookPayload("Titulo", "Autor", 2101, StatusLeitura.QUERO_LER), "Ano de publicacao deve ser menor ou igual a 2100."),
                Arguments.of(bookPayload("Titulo", "Autor", 2020, null), "Status de leitura e obrigatorio.")
        );
    }

    private static Stream<Arguments> invalidStatusRequests() {
        return Stream.of(
                Arguments.of("""
                        {
                            "titulo": "Titulo",
                            "autor": "Autor",
                            "anoPublicacao": 2020,
                            "statusLeitura": "INVALIDO"
                        }
                        """, "Status de leitura invalido.")
        );
    }

    private static Map<String, Object> registerPayload(String nome, String email, String senha) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("nome", nome);
        payload.put("email", email);
        payload.put("senha", senha);
        return payload;
    }

    private static Map<String, Object> bookPayload(String titulo, String autor, Integer anoPublicacao, StatusLeitura statusLeitura) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("titulo", titulo);
        payload.put("autor", autor);
        payload.put("genero", "Tecnologia");
        payload.put("anoPublicacao", anoPublicacao);
        payload.put("isbn", "9780132350884");
        payload.put("statusLeitura", statusLeitura);
        return payload;
    }

    private static class AuthenticatedUserArgumentResolver implements HandlerMethodArgumentResolver {

        @Override
        public boolean supportsParameter(MethodParameter parameter) {
            return parameter.hasParameterAnnotation(AuthenticationPrincipal.class)
                    && parameter.getParameterType().equals(User.class);
        }

        @Override
        public Object resolveArgument(
                MethodParameter parameter,
                ModelAndViewContainer mavContainer,
                NativeWebRequest webRequest,
                WebDataBinderFactory binderFactory
        ) {
            User user = new User("Test User", "test@example.com", "password");
            user.setId("user-1");
            return user;
        }
    }
}
