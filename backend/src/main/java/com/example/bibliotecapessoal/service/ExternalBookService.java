package com.example.bibliotecapessoal.service;

import com.example.bibliotecapessoal.dto.BookSearchResult;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;

@Service
public class ExternalBookService {

    private static final int MAX_RESULTS = 12;

    private final RestClient restClient;

    public ExternalBookService(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder.build();
    }

    public List<BookSearchResult> search(String query) {
        String url = UriComponentsBuilder
                .fromUriString("https://openlibrary.org/search.json")
                .queryParam("q", query)
                .queryParam("limit", MAX_RESULTS)
                .queryParam("fields", "title,author_name,first_publish_year,isbn,subject")
                .build()
                .encode()
                .toUriString();

        JsonNode response = restClient.get()
                .uri(url)
                .retrieve()
                .body(JsonNode.class);

        List<BookSearchResult> results = new ArrayList<>();

        if (response == null || !response.has("docs")) {
            return results;
        }

        for (JsonNode item : response.get("docs")) {
            String titulo = text(item, "title");
            String autor = firstText(item, "author_name");

            if (titulo == null || autor == null) {
                continue;
            }

            results.add(new BookSearchResult(
                    titulo,
                    autor,
                    firstText(item, "subject"),
                    integer(item, "first_publish_year"),
                    firstText(item, "isbn"),
                    "QUERO_LER"
            ));
        }

        return results;
    }

    private String text(JsonNode node, String field) {
        JsonNode value = node.get(field);
        return value != null && value.isTextual() ? value.asText() : null;
    }

    private String firstText(JsonNode node, String field) {
        JsonNode values = node.get(field);
        return values != null && values.isArray() && !values.isEmpty() ? values.get(0).asText() : null;
    }

    private Integer integer(JsonNode node, String field) {
        JsonNode value = node.get(field);
        return value != null && value.isNumber() ? value.asInt() : null;
    }
}
