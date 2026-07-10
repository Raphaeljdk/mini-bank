package com.minibank.investment.repository;

import com.minibank.investment.domain.UserInvestment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserInvestmentRepository extends JpaRepository<UserInvestment, Long> {
    List<UserInvestment> findByUsername(String username);
    List<UserInvestment> findByUsernameAndAssetSymbol(String username, String assetSymbol);
}
