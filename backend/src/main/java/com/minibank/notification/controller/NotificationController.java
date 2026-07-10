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
        
        // SimulaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de envio de email
        System.out.println("ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒâ€šÃ‚Â§ Email enviado para: " + email);
        System.out.println("ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒâ€šÃ‚Â§ Assunto: " + subject);
        System.out.println("ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒâ€šÃ‚Â§ Mensagem: " + message);
        
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
