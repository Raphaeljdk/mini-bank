package com.minibank.finance.controller;

import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/finance")
public class FinanceController {

    private final List<Map<String, Object>> transactions = new ArrayList<>();
    private long nextId = 1;

    @PostMapping("/transaction")
    public Map<String, Object> add(@RequestBody Map<String, Object> body) {
        body.put("id", nextId++);
        body.put("date", LocalDateTime.now().toString());
        transactions.add(0, body);
        return Map.of("message", "OK", "id", body.get("id"));
    }

    @GetMapping("/transactions/{accountId}")
    public List<Map<String, Object>> list(@PathVariable Long accountId) {
        return transactions;
    }

    @GetMapping("/summary/{accountId}")
    public Map<String, Object> summary(@PathVariable Long accountId) {
        double rec = 0, desp = 0;
        for (Map<String, Object> tx : transactions) {
            double v = Double.parseDouble(tx.get("amount").toString());
            if ("RECEITA".equals(tx.get("type"))) rec += v; else desp += v;
        }
        return Map.of("totalReceitas", rec, "totalDespesas", desp, "saldo", rec - desp, "categories", List.of());
    }

    @PutMapping("/transaction/{id}/status")
    public Map<String, Object> status(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return Map.of("message", "OK");
    }

    @DeleteMapping("/transaction/{id}")
    public Map<String, Object> delete(@PathVariable Long id) { return Map.of("message", "OK"); }
}
