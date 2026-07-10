package com.minibank.account.repository;

import com.minibank.account.domain.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByDocument(String document);
    boolean existsByDocument(String document);
    long countByStatus(com.minibank.account.domain.AccountStatus status);
}
