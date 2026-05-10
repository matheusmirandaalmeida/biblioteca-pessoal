package com.example.bibliotecapessoal.service;

import com.example.bibliotecapessoal.dto.BookSearchResult;
import io.specto.hoverfly.junit5.HoverflyExtension;
import io.specto.hoverfly.junit5.api.HoverflySimulate;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.web.client.RestClient;

import java.util.List;

import static io.specto.hoverfly.junit5.api.HoverflySimulate.SourceType.CLASSPATH;
import static org.assertj.core.api.Assertions.assertThat;

@HoverflySimulate(
        source = @HoverflySimulate.Source(value = "hoverfly/open-library-search.json", type = CLASSPATH),
        enableAutoCapture = true
)
@ExtendWith(HoverflyExtension.class)
class ExternalBookServiceVcrTest {

    @Test
    void searchMapsRecordedOpenLibraryResponse() {
        ExternalBookService externalBookService = new ExternalBookService(RestClient.builder());

        List<BookSearchResult> results = externalBookService.search("clean code");

        assertThat(results)
                .containsExactly(new BookSearchResult(
                        "Clean Code",
                        "Robert C. Martin",
                        "Software engineering",
                        2008,
                        "9780132350884",
                        "QUERO_LER"
                ));
    }
}
