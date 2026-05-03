package com.example.bibliotecapessoal.security;

import com.example.bibliotecapessoal.model.User;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class JwtService {

    private static final Base64.Encoder BASE64_URL_ENCODER = Base64.getUrlEncoder().withoutPadding();
    private static final Base64.Decoder BASE64_URL_DECODER = Base64.getUrlDecoder();

    private final ObjectMapper objectMapper;
    private final byte[] secret;
    private final long expirationSeconds;

    public JwtService(
            ObjectMapper objectMapper,
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-seconds:86400}") long expirationSeconds
    ) {
        this.objectMapper = objectMapper;
        this.secret = secret.getBytes(StandardCharsets.UTF_8);
        this.expirationSeconds = expirationSeconds;
    }

    public String generateToken(User user) {
        Instant now = Instant.now();

        Map<String, Object> header = Map.of(
                "alg", "HS256",
                "typ", "JWT"
        );
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("sub", user.getId());
        payload.put("email", user.getEmail());
        payload.put("iat", now.getEpochSecond());
        payload.put("exp", now.plusSeconds(expirationSeconds).getEpochSecond());

        String encodedHeader = encodeJson(header);
        String encodedPayload = encodeJson(payload);
        String unsignedToken = encodedHeader + "." + encodedPayload;

        return unsignedToken + "." + sign(unsignedToken);
    }

    public Optional<String> extractSubject(String token) {
        try {
            String[] parts = token.split("\\.");

            if (parts.length != 3) {
                return Optional.empty();
            }

            String unsignedToken = parts[0] + "." + parts[1];

            if (!constantTimeEquals(sign(unsignedToken), parts[2])) {
                return Optional.empty();
            }

            Map<?, ?> payload = objectMapper.readValue(BASE64_URL_DECODER.decode(parts[1]), Map.class);
            Object exp = payload.get("exp");

            if (!(exp instanceof Number expiration) || expiration.longValue() < Instant.now().getEpochSecond()) {
                return Optional.empty();
            }

            Object subject = payload.get("sub");
            return subject instanceof String value ? Optional.of(value) : Optional.empty();
        } catch (Exception exception) {
            return Optional.empty();
        }
    }

    private String encodeJson(Map<String, Object> data) {
        try {
            return BASE64_URL_ENCODER.encodeToString(objectMapper.writeValueAsBytes(data));
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Nao foi possivel gerar o token.", exception);
        }
    }

    private String sign(String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret, "HmacSHA256"));
            return BASE64_URL_ENCODER.encodeToString(mac.doFinal(data.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception exception) {
            throw new IllegalStateException("Nao foi possivel assinar o token.", exception);
        }
    }

    private boolean constantTimeEquals(String expected, String actual) {
        byte[] expectedBytes = expected.getBytes(StandardCharsets.UTF_8);
        byte[] actualBytes = actual.getBytes(StandardCharsets.UTF_8);

        if (expectedBytes.length != actualBytes.length) {
            return false;
        }

        int result = 0;
        for (int i = 0; i < expectedBytes.length; i++) {
            result |= expectedBytes[i] ^ actualBytes[i];
        }
        return result == 0;
    }
}
