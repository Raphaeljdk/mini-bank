package com.minibank.transfer.controller;

import com.minibank.account.domain.Account;
import com.minibank.account.repository.AccountRepository;
import com.minibank.transaction.domain.LedgerEntry;
import com.minibank.transaction.domain.TransactionType;
import com.minibank.transaction.repository.LedgerEntryRepository;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/transfer")
public class TransferController {

    private final AccountRepository accountRepository;
    private final LedgerEntryRepository ledgerEntryRepository;

    public TransferController(AccountRepository accountRepository, LedgerEntryRepository ledgerEntryRepository) {
        this.accountRepository = accountRepository;
        this.ledgerEntryRepository = ledgerEntryRepository;
    }

    @PostMapping("/pix")
    public Map<String, Object> pix(@RequestBody Map<String, Object> body) {
        Long fromAccountId = Long.valueOf(body.get("fromAccountId").toString());
        String toDocument = body.get("toDocument").toString();
        BigDecimal amount = new BigDecimal(body.get("amount").toString());
        String description = body.getOrDefault("description", "PIX").toString();

        Account from = accountRepository.findById(fromAccountId)
                .orElseThrow(() -> new RuntimeException("Conta origem nao encontrada"));
        Account to = accountRepository.findByDocument(toDocument)
                .orElseThrow(() -> new RuntimeException("Conta destino nao encontrada"));

        if (from.getBalance().compareTo(amount) < 0) {
            return Map.of("error", "Saldo insuficiente!");
        }

        // Debitar origem
        from.setBalance(from.getBalance().subtract(amount));
        accountRepository.save(from);

        // Creditar destino
        to.setBalance(to.getBalance().add(amount));
        accountRepository.save(to);

        // Registrar no ledger
        String eventId = "PIX-" + UUID.randomUUID().toString().substring(0, 8);
        ledgerEntryRepository.save(LedgerEntry.builder()
                .accountId(fromAccountId).type(TransactionType.DEBIT).amount(amount)
                .description("PIX enviado: " + description).eventId(eventId).timestamp(LocalDateTime.now()).build());
        ledgerEntryRepository.save(LedgerEntry.builder()
                .accountId(to.getId()).type(TransactionType.CREDIT).amount(amount)
                .description("PIX recebido: " + description).eventId(eventId + "-rcv").timestamp(LocalDateTime.now()).build());

        return Map.of(
            "message", "PIX realizado com sucesso!",
            "from", from.getOwner(), "to", to.getOwner(),
            "amount", amount.doubleValue(), "eventId", eventId,
            "timestamp", LocalDateTime.now().toString()
        );
    }

    @GetMapping("/history/{accountId}")
    public List<Map<String, Object>> history(@PathVariable Long accountId) {
        List<LedgerEntry> entries = ledgerEntryRepository.findByAccountIdOrderByTimestampDesc(accountId);
        List<Map<String, Object>> result = new ArrayList<>();
        for (LedgerEntry e : entries) {
            if (e.getDescription().contains("PIX")) {
                result.add(Map.of(
                    "id", e.getId(), "type", e.getType().name(), "amount", e.getAmount().doubleValue(),
                    "description", e.getDescription(), "eventId", e.getEventId(), "timestamp", e.getTimestamp().toString()
                ));
            }
        }
        return result;
    }
}
