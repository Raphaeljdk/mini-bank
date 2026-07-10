package com.minibank.account.infrastructure;

import com.minibank.account.domain.Account;
import com.minibank.account.service.AccountService;
import com.minibank.transaction.domain.LedgerEntry;
import com.minibank.transaction.repository.LedgerEntryRepository;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;
    private final LedgerEntryRepository ledgerEntryRepository;

    public AccountController(AccountService accountService, LedgerEntryRepository ledgerEntryRepository) {
        this.accountService = accountService;
        this.ledgerEntryRepository = ledgerEntryRepository;
    }

    @GetMapping
    public List<Map<String, Object>> listAccounts() {
        List<Map<String, Object>> result = new ArrayList<>();
        for (Account acc : accountService.findAll()) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", acc.getId().toString());
            map.put("owner", acc.getOwner());
            map.put("document", maskDocument(acc.getDocument()));
            map.put("balance", acc.getBalance().doubleValue());
            map.put("status", acc.getStatus().name());
            map.put("createdAt", acc.getCreatedAt().toString());
            result.add(map);
        }
        return result;
    }

    @PostMapping
    public Map<String, Object> createAccount(@RequestBody Map<String, String> body) {
        Account acc = accountService.criarConta(body.get("owner"), body.get("document"));
        return Map.of(
            "id", acc.getId().toString(), "owner", acc.getOwner(),
            "document", maskDocument(acc.getDocument()), "balance", 0.00,
            "status", "ACTIVE", "createdAt", LocalDateTime.now().toString()
        );
    }

    @GetMapping("/{id}/ledger")
    public List<Map<String, Object>> getLedger(@PathVariable Long id) {
        List<LedgerEntry> entries = ledgerEntryRepository.findByAccountIdOrderByTimestampDesc(id);
        List<Map<String, Object>> result = new ArrayList<>();
        for (LedgerEntry e : entries) {
            result.add(Map.of(
                "id", e.getId().toString(), "accountId", e.getAccountId().toString(),
                "type", e.getType().name(), "amount", e.getAmount().doubleValue(),
                "description", e.getDescription(), "timestamp", e.getTimestamp().toString(),
                "eventId", e.getEventId()
            ));
        }
        return result;
    }

    @GetMapping("/all-ledger")
    public List<Map<String, Object>> getAllLedger() {
        List<LedgerEntry> entries = ledgerEntryRepository.findTop10ByOrderByTimestampDesc();
        List<Map<String, Object>> result = new ArrayList<>();
        for (LedgerEntry e : entries) {
            result.add(Map.of(
                "id", e.getId().toString(), "accountId", e.getAccountId().toString(),
                "type", e.getType().name(), "amount", e.getAmount().doubleValue(),
                "description", e.getDescription(), "timestamp", e.getTimestamp().toString(),
                "eventId", e.getEventId()
            ));
        }
        return result;
    }

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() {
        return Map.of(
            "totalAccounts", accountService.totalAccounts(),
            "totalTransactions", accountService.totalTransactions(),
            "lastReconciliation", LocalDateTime.now().minusHours(2).toString(),
            "systemStatus", "UP"
        );
    }

    @GetMapping("/{id}/balance")
    public Map<String, Object> getBalance(@PathVariable Long id) {
        Account acc = accountService.findById(id);
        BigDecimal monthlyRate = new BigDecimal("0.005");
        BigDecimal projectedYield = acc.getBalance().multiply(monthlyRate).setScale(2, RoundingMode.HALF_UP);
        BigDecimal yearlyYield = projectedYield.multiply(new BigDecimal("12")).setScale(2, RoundingMode.HALF_UP);
        return Map.of(
            "balance", acc.getBalance().doubleValue(), "monthlyYield", projectedYield.doubleValue(),
            "yearlyYield", yearlyYield.doubleValue(), "yieldPercent", "0.5",
            "accountId", acc.getId(), "owner", acc.getOwner()
        );
    }

    private String maskDocument(String doc) {
        if (doc != null && doc.length() == 11) {
            return doc.substring(0, 3) + ".***." + doc.substring(7, 9) + "-" + doc.substring(9);
        }
        return doc;
    }
}
