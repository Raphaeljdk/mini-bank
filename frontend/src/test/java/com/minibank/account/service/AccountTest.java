package com.minibank.account.service;

import com.minibank.account.domain.Account;
import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;

class AccountTest {

    @Test
    void testCredit() {
        Account account = Account.builder().balance(new BigDecimal("100")).build();
        account.credit(new BigDecimal("50"));
        assertEquals(new BigDecimal("150"), account.getBalance());
    }

    @Test
    void testDebit() {
        Account account = Account.builder().balance(new BigDecimal("100")).build();
        account.debit(new BigDecimal("50"));
        assertEquals(new BigDecimal("50"), account.getBalance());
    }
}
