package com.minibank.account.infrastructure;

import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final List<Map<String, Object>> accounts = new ArrayList<>(List.of(
        Map.of("id","1","owner","Administrador","document","000.***.***-00","balance",250000.0,"status","ACTIVE","createdAt","2024-01-15"),
        Map.of("id","2","owner","Gerente Silva","document","111.***.***-11","balance",85000.0,"status","ACTIVE","createdAt","2024-02-20"),
        Map.of("id","3","owner","João Cliente","document","222.***.***-22","balance",5000.0,"status","ACTIVE","createdAt","2024-03-10")
    ));

    @GetMapping
    public List<Map<String, Object>> list() { return accounts; }

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() {
        return Map.of("totalAccounts", accounts.size(), "totalTransactions", 145, "lastReconciliation", LocalDateTime.now().toString(), "systemStatus", "UP");
    }

    @GetMapping("/all-ledger")
    public List<Map<String, Object>> allLedger() {
        return List.of(
            Map.of("id","1","accountId","1","type","CREDIT","amount",5000.0,"description","Depósito inicial","eventId","evt-001","timestamp",LocalDateTime.now().toString()),
            Map.of("id","2","accountId","1","type","DEBIT","amount",250.0,"description","Pagamento","eventId","evt-002","timestamp",LocalDateTime.now().toString())
        );
    }

    @GetMapping("/{id}/ledger")
    public List<Map<String, Object>> ledger(@PathVariable String id) { return allLedger(); }

    @GetMapping("/{id}/balance")
    public Map<String, Object> balance(@PathVariable String id) {
        return Map.of("balance", 5000.0, "monthlyYield", 25.0, "yearlyYield", 300.0, "yieldPercent", "0.5", "accountId", id, "owner", "Cliente");
    }
}
