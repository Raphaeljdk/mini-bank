package com.minibank.notification.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @PostMapping("/email")
    public Map<String, Object> sendEmail(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String subject = body.get("subject");
        String message = body.get("message");
        
        // Simulação de envio de email
        System.out.println("📧 Email enviado para: " + email);
        System.out.println("📧 Assunto: " + subject);
        System.out.println("📧 Mensagem: " + message);
        
        return Map.of("message", "Email enviado com sucesso para " + email + "! (simulado)");
    }

    @GetMapping("/weekly-summary/{email}")
    public Map<String, Object> weeklySummary(@PathVariable String email) {
        return Map.of(
            "message", "Resumo semanal enviado para " + email,
            "totalReceitas", 5200.00,
            "totalDespesas", 3800.00,
            "saldo", 1400.00,
            "contasVencendo", 2
        );
    }
}
