package com.minibank.investment.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/investments")
public class InvestmentController {

    @GetMapping("/portfolio/{username}")
    public List<Map<String, Object>> portfolio(@PathVariable String username) { return List.of(); }

    @PostMapping("/buy")
    public Map<String, Object> buy(@RequestBody Map<String, Object> body) {
        return Map.of("message", "Compra simulada com sucesso!");
    }
}
