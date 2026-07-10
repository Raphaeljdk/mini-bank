package com.minibank.account.service;

import com.minibank.account.domain.Account;
import com.minibank.account.domain.AccountStatus;
import com.minibank.account.repository.AccountRepository;
import com.minibank.transaction.domain.LedgerEntry;
import com.minibank.transaction.domain.TransactionType;
import com.minibank.transaction.repository.LedgerEntryRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final LedgerEntryRepository ledgerEntryRepository;
    private final Random random = new Random();

    public AccountService(AccountRepository accountRepository, LedgerEntryRepository ledgerEntryRepository) {
        this.accountRepository = accountRepository;
        this.ledgerEntryRepository = ledgerEntryRepository;
    }

    @PostConstruct
    @Transactional
    public void initData() {
        if (accountRepository.count() == 0) {
            criarContaDemo("Administrador Sistema", "000.000.000-00", new BigDecimal("250000.00"));
            criarContaDemo("Gerente Silva", "111.111.111-11", new BigDecimal("85000.00"));
            criarContaDemo("Joao Cliente", "222.222.222-22", new BigDecimal("5000.00"));
            criarContaDemo("Maria Oliveira", "333.333.333-33", new BigDecimal("12500.00"));
            criarContaDemo("Pedro Santos", "444.444.444-44", new BigDecimal("3200.75"));
            criarContaDemo("Ana Costa", "555.555.555-55", new BigDecimal("78000.00"));
            criarContaDemo("Carlos Lima", "666.666.666-66", new BigDecimal("150000.00"));
            criarContaDemo("Fernanda Souza", "777.777.777-77", new BigDecimal("42000.00"));
            criarContaDemo("Ricardo Alves", "888.888.888-88", new BigDecimal("950.30"));
            criarContaDemo("Juliana Pereira", "999.999.999-99", new BigDecimal("63000.00"));
        }
    }

    @Transactional
    public void criarContaDemo(String owner, String document, BigDecimal balance) {
        Account account = Account.builder()
                .owner(owner).document(document).balance(balance)
                .status(AccountStatus.ACTIVE).build();
        account = accountRepository.save(account);

        if (balance.compareTo(BigDecimal.ZERO) > 0) {
            LedgerEntry entry = LedgerEntry.builder()
                    .accountId(account.getId())
                    .type(TransactionType.CREDIT)
                    .amount(balance)
                    .description("Deposito inicial")
                    .eventId("evt-init-" + document.replace(".", ""))
                    .timestamp(LocalDateTime.now().minusDays(random.nextInt(30) + 1))
                    .build();
            ledgerEntryRepository.save(entry);
        }

        for (int i = 0; i < random.nextInt(10) + 3; i++) {
            boolean isCredit = random.nextBoolean();
            BigDecimal amount = new BigDecimal(random.nextInt(5000) + 50);
            String[] descriptions = {"Pagamento PIX", "Transferencia TED", "Saque ATM", "Deposito",
                    "Pagamento de conta", "Recebimento salario", "Compra online", "Investimento",
                    "Restaurante", "Supermercado", "Uber", "Netflix", "Spotify", "Aluguel"};

            LedgerEntry entry = LedgerEntry.builder()
                    .accountId(account.getId())
                    .type(isCredit ? TransactionType.CREDIT : TransactionType.DEBIT)
                    .amount(amount)
                    .description(descriptions[random.nextInt(descriptions.length)])
                    .eventId("evt-" + System.currentTimeMillis() + "-" + i)
                    .timestamp(LocalDateTime.now().minusHours(random.nextInt(720)))
                    .build();
            ledgerEntryRepository.save(entry);

            if (isCredit) {
                account.setBalance(account.getBalance().add(amount));
            } else {
                if (account.getBalance().compareTo(amount) >= 0) {
                    account.setBalance(account.getBalance().subtract(amount));
                }
            }
            accountRepository.save(account);
        }
    }

    public List<Account> findAll() {
        return accountRepository.findAll();
    }

    @Transactional
    public Account criarConta(String owner, String document) {
        if (accountRepository.existsByDocument(document)) {
            throw new RuntimeException("CPF ja cadastrado");
        }
        Account account = Account.builder()
                .owner(owner).document(document).balance(BigDecimal.ZERO)
                .status(AccountStatus.ACTIVE).build();
        return accountRepository.save(account);
    }

    public Account findById(Long id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conta nao encontrada"));
    }

    public long totalAccounts() {
        return accountRepository.count();
    }

    public long totalTransactions() {
        return ledgerEntryRepository.count();
    }
}
