package com.minibank.finance.controller;

import com.minibank.finance.domain.UserTransaction;
import com.minibank.finance.repository.UserTransactionRepository;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/finance")
public class FinanceController {

    private final UserTransactionRepository transactionRepository;
    private final List<String> customCategories = new ArrayList<>(List.of(
        "Salario", "Freelance", "Investimento", "Aluguel", "Alimentacao",
        "Transporte", "Lazer", "Contas", "Saude", "Educacao", "Outros"
    ));

    public FinanceController(UserTransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @PostMapping("/transaction")
    public Map<String, Object> addTransaction(@RequestBody Map<String, Object> body) {
        UserTransaction tx = UserTransaction.builder()
                .accountId(Long.valueOf(body.get("accountId").toString()))
                .type(body.get("type").toString())
                .amount(new BigDecimal(body.get("amount").toString()))
                .category(body.get("category").toString())
                .description(body.get("description").toString())
                .date(LocalDateTime.now())
                .dueDate(body.get("dueDate") != null ? LocalDate.parse(body.get("dueDate").toString()) : null)
                .status(body.get("status") != null ? body.get("status").toString() : "PENDENTE")
                .build();
        transactionRepository.save(tx);
        return Map.of("message", "Transacao adicionada!", "id", tx.getId());
    }

    @GetMapping("/transactions/{accountId}")
    public List<Map<String, Object>> getTransactions(@PathVariable Long accountId) {
        List<UserTransaction> txs = transactionRepository.findByAccountIdOrderByDateDesc(accountId);
        List<Map<String, Object>> result = new ArrayList<>();
        for (UserTransaction tx : txs) {
            result.add(Map.of(
                "id", tx.getId(), "type", tx.getType(), "amount", tx.getAmount().doubleValue(),
                "category", tx.getCategory(), "description", tx.getDescription(),
                "date", tx.getDate().toString(),
                "dueDate", tx.getDueDate() != null ? tx.getDueDate().toString() : "",
                "status", tx.getStatus()
            ));
        }
        return result;
    }

    @PutMapping("/transaction/{id}/status")
    public Map<String, Object> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        UserTransaction tx = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transacao nao encontrada"));
        tx.setStatus(body.get("status"));
        transactionRepository.save(tx);
        return Map.of("message", "Status atualizado!");
    }

    @GetMapping("/summary/{accountId}")
    public Map<String, Object> getSummary(@PathVariable Long accountId) {
        BigDecimal receitas = transactionRepository.sumByAccountIdAndType(accountId, "RECEITA");
        BigDecimal despesas = transactionRepository.sumByAccountIdAndType(accountId, "DESPESA");
        if (receitas == null) receitas = BigDecimal.ZERO;
        if (despesas == null) despesas = BigDecimal.ZERO;

        List<Object[]> expensesByCategory = transactionRepository.sumExpensesByCategory(accountId);
        List<Map<String, Object>> categories = new ArrayList<>();
        for (Object[] row : expensesByCategory) {
            categories.add(Map.of("category", row[0].toString(), "amount", Double.valueOf(row[1].toString())));
        }

        return Map.of(
            "totalReceitas", receitas.doubleValue(),
            "totalDespesas", despesas.doubleValue(),
            "saldo", receitas.subtract(despesas).doubleValue(),
            "categories", categories
        );
    }

    @DeleteMapping("/transaction/{id}")
    public Map<String, Object> deleteTransaction(@PathVariable Long id) {
        transactionRepository.deleteById(id);
        return Map.of("message", "Transacao removida!");
    }

    @GetMapping("/categories")
    public List<String> getCategories() {
        return customCategories;
    }

    @PostMapping("/categories")
    public Map<String, Object> addCategory(@RequestBody Map<String, String> body) {
        String category = body.get("category");
        if (category != null && !category.trim().isEmpty() && !customCategories.contains(category)) {
            customCategories.add(category);
        }
        return Map.of("message", "Categoria adicionada!", "categories", customCategories);
    }
}
