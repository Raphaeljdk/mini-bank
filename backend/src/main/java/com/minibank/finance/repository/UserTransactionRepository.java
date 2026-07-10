package com.minibank.finance.repository;

import com.minibank.finance.domain.UserTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.math.BigDecimal;
import java.util.List;

public interface UserTransactionRepository extends JpaRepository<UserTransaction, Long> {
    List<UserTransaction> findByAccountIdOrderByDateDesc(Long accountId);
    List<UserTransaction> findByAccountIdAndTypeOrderByDateDesc(Long accountId, String type);
    
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM UserTransaction t WHERE t.accountId = :accountId AND t.type = :type")
    BigDecimal sumByAccountIdAndType(Long accountId, String type);
    
    @Query("SELECT t.category, COALESCE(SUM(t.amount), 0) FROM UserTransaction t WHERE t.accountId = :accountId AND t.type = 'DESPESA' GROUP BY t.category")
    List<Object[]> sumExpensesByCategory(Long accountId);
}
