package com.minibank.transaction.repository;

import com.minibank.transaction.domain.LedgerEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LedgerEntryRepository extends JpaRepository<LedgerEntry, Long> {
    List<LedgerEntry> findByAccountIdOrderByTimestampDesc(Long accountId);
    long countByAccountId(Long accountId);
    List<LedgerEntry> findTop10ByOrderByTimestampDesc();
}
