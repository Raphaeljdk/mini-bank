package com.minibank.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final Map<String, Map<String, String>> users = new HashMap<>();

    public AuthController() {
        users.put("admin", Map.of("password", "admin123", "role", "ADMIN", "fullName", "Administrador"));
        users.put("cliente", Map.of("password", "cliente123", "role", "CLIENTE", "fullName", "João Cliente"));
        users.put("gerente", Map.of("password", "gerente123", "role", "GERENTE", "fullName", "Gerente Silva"));
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        Map<String, String> user = users.get(username);
        
        if (user == null || !user.get("password").equals(password)) {
            return Map.of("error", "Credenciais invalidas");
        }
        
        return Map.of(
            "token", "jwt-" + username + "-" + System.currentTimeMillis(),
            "username", username,
            "fullName", user.get("fullName"),
            "role", user.get("role"),
            "accountId", 3
        );
    }

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        if (users.containsKey(username)) return Map.of("error", "Usuário já existe");
        users.put(username, Map.of("password", body.get("password"), "role", "CLIENTE", "fullName", body.getOrDefault("fullName", username)));
        return Map.of("message", "Conta criada!", "username", username);
    }
}
