package com.habitify.habitservice.security;

import com.habitify.habitservice.model.User;
import com.habitify.habitservice.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

@Override
protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
) throws ServletException, IOException {

    System.out.println("=== JWT FILTER START ===");
    System.out.println("URI: " + request.getRequestURI());

    String authHeader = request.getHeader("Authorization");
    System.out.println("Auth header: " + authHeader);

    if (authHeader != null && authHeader.startsWith("Bearer ")) {
        String token = authHeader.substring(7);
        System.out.println("Token extracted");

        boolean valid = jwtUtil.validateToken(token);
        System.out.println("Token valid: " + valid);

        if (valid) {
            String username = jwtUtil.extractUsername(token);
            System.out.println("Username from token: " + username);

            // TEMP: DO NOT TOUCH DB
            request.setAttribute("X-User-Id", username);

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            username,
                            null,
                            List.of(new SimpleGrantedAuthority("ROLE_USER"))
                    );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            System.out.println("Authentication set");
        }
    }

    filterChain.doFilter(request, response);
}

}
