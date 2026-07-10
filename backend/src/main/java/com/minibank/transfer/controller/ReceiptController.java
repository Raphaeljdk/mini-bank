package com.minibank.transfer.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/receipt")
public class ReceiptController {

    @PostMapping("/generate")
    public Map<String, Object> generateReceipt(@RequestBody Map<String, Object> body) {
        return Map.of(
            "receiptId", "REC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(),
            "date", new Date().toString(),
            "from", body.getOrDefault("from", "N/A"),
            "to", body.getOrDefault("to", "N/A"),
            "amount", body.getOrDefault("amount", 0),
            "type", body.getOrDefault("type", "PIX"),
            "description", body.getOrDefault("description", ""),
            "authCode", UUID.randomUUID().toString().substring(0, 6).toUpperCase()
        );
    }
}
