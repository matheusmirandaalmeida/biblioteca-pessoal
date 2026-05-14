package com.example.bibliotecapessoal.security;

import com.example.bibliotecapessoal.AbstractMongoIntegrationTest;
import com.example.bibliotecapessoal.model.User;
import com.example.bibliotecapessoal.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;

class JwtAuthenticationFilterTest extends AbstractMongoIntegrationTest {

    @Autowired
    private JwtAuthenticationFilter filter;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @AfterEach
    void cleanUp() {
        SecurityContextHolder.clearContext();
        userRepository.deleteAll();
    }

    @Test
    void doFilterContinuesWithoutAuthorizationHeader() throws Exception {
        RecordingFilterChain filterChain = new RecordingFilterChain();
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        filter.doFilter(request, response, filterChain);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        assertThat(filterChain.invocations).isEqualTo(1);
    }

    @Test
    void doFilterAuthenticatesUserFromBearerToken() throws Exception {
        RecordingFilterChain filterChain = new RecordingFilterChain();
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        User user = userRepository.save(new User("Maria", "maria@example.com", "password"));
        request.addHeader("Authorization", "Bearer " + jwtService.generateToken(user));

        filter.doFilter(request, response, filterChain);

        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        assertThat(principal).isInstanceOf(User.class);
        assertThat(((User) principal).getId()).isEqualTo(user.getId());
        assertThat(filterChain.invocations).isEqualTo(1);
    }

    @Test
    void doFilterDoesNotReplaceExistingAuthentication() throws Exception {
        RecordingFilterChain filterChain = new RecordingFilterChain();
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        User existingUser = new User("Existing", "existing@example.com", "password");
        User tokenUser = userRepository.save(new User("Maria", "maria@example.com", "password"));
        request.addHeader("Authorization", "Bearer " + jwtService.generateToken(tokenUser));
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(existingUser, null)
        );

        filter.doFilter(request, response, filterChain);

        assertThat(SecurityContextHolder.getContext().getAuthentication().getPrincipal()).isSameAs(existingUser);
        assertThat(filterChain.invocations).isEqualTo(1);
    }

    private static class RecordingFilterChain implements FilterChain {
        private int invocations;

        @Override
        public void doFilter(ServletRequest request, ServletResponse response) throws IOException {
            invocations++;
        }
    }
}
