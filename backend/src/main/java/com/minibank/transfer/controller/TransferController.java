package com.minibank.transfer.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/transfer")
public class TransferController {

    @PostMapping("/pix")
    public Map<String, Object> pix(@RequestBody Map<String, Object> body) {
        return Map.of("message", "PIX simulado com sucesso!", "amount", body.get("amount"));
    }
}
