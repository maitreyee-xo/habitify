package com.habitify.authservice.controller;

import com.habitify.authservice.dto.LoginRequest;
import com.habitify.authservice.dto.RegisterRequest;
import com.habitify.authservice.model.User;
import com.habitify.authservice.repository.UserRepository;
import com.habitify.authservice.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {

        if (userRepository.existsByUsername(req.getUsername())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Username already exists"));
        }

        User user = new User(
                null,
                req.getUsername(),
                passwordEncoder.encode(req.getPassword()),
                "USER"
        );

        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {

        System.out.println("🔥 LOGIN HIT: " + req.getUsername());

        return userRepository.findByUsername(req.getUsername())
                .filter(user -> passwordEncoder.matches(req.getPassword(), user.getPassword()))
                .map(user -> {
                    String token = jwtUtil.generateToken(user.getUsername());
                    return ResponseEntity.ok(Map.of("token", token));
                })
                .orElseGet(() ->
                        ResponseEntity.status(401)
                                .body(Map.of("error", "Invalid credentials"))
                );
    }

    @GetMapping("/me")
    public String me() {
        return "OK – authenticated";
    }
}
