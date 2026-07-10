package com.minibank.investment.controller;

import com.minibank.investment.domain.UserInvestment;
import com.minibank.investment.repository.UserInvestmentRepository;
import com.minibank.finance.repository.UserTransactionRepository;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/investments")
public class InvestmentController {

    private final UserInvestmentRepository investmentRepository;
    private final UserTransactionRepository transactionRepository;

    // PreÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§os mockados (futuro: API real)
    private final Map<String, Double> cryptoPrices = Map.of(
        "BTC", 285000.00, "ETH", 15800.00, "BNB", 2100.00,
        "SOL", 680.00, "ADA", 3.20, "XRP", 4.80
    );
    private final Map<String, Double> stockPrices = Map.of(
        "PETR4", 42.50, "VALE3", 68.30, "ITUB4", 35.20,
        "ABEV3", 15.80, "WEGE3", 52.40, "RENT3", 72.60
    );

    public InvestmentController(UserInvestmentRepository investmentRepository, UserTransactionRepository transactionRepository) {
        this.investmentRepository = investmentRepository;
        this.transactionRepository = transactionRepository;
    }

    @GetMapping("/portfolio/{username}")
    public List<Map<String, Object>> getPortfolio(@PathVariable String username) {
        List<UserInvestment> investments = investmentRepository.findByUsername(username);
        List<Map<String, Object>> result = new ArrayList<>();
        for (UserInvestment inv : investments) {
            double currentPrice = getCurrentPrice(inv.getAssetSymbol(), inv.getAssetType());
            result.add(Map.of(
                "id", inv.getId(), "assetType", inv.getAssetType(), "assetSymbol", inv.getAssetSymbol(),
                "assetName", inv.getAssetSymbol(), "quantity", inv.getQuantity().doubleValue(),
                "purchasePrice", inv.getPurchasePrice().doubleValue(), "currentPrice", currentPrice
            ));
        }
        return result;
    }

    @PostMapping("/buy")
    public Map<String, Object> buy(@RequestBody Map<String, Object> body) {
        String username = body.get("username").toString();
        String type = body.get("type").toString();
        String symbol = body.get("symbol").toString();
        double quantity = Double.parseDouble(body.get("quantity").toString());
        double currentPrice = getCurrentPrice(symbol, type);
        double totalCost = currentPrice * quantity;

        // Verificar saldo
        BigDecimal saldo = transactionRepository.sumByAccountIdAndType(
            Long.valueOf(body.get("accountId").toString()), "RECEITA");
        BigDecimal despesas = transactionRepository.sumByAccountIdAndType(
            Long.valueOf(body.get("accountId").toString()), "DESPESA");
        if (saldo == null) saldo = BigDecimal.ZERO;
        if (despesas == null) despesas = BigDecimal.ZERO;
        double balance = saldo.subtract(despesas).doubleValue();

        if (balance < totalCost) {
            return Map.of("error", "Saldo insuficiente! Necessario: R$ " + String.format("%.2f", totalCost));
        }

        // Verificar se jÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ tem esse ativo
        List<UserInvestment> existing = investmentRepository.findByUsernameAndAssetSymbol(username, symbol);
        UserInvestment investment;
        if (!existing.isEmpty()) {
            investment = existing.get(0);
            BigDecimal newQty = investment.getQuantity().add(BigDecimal.valueOf(quantity));
            BigDecimal totalCostBd = investment.getPurchasePrice().multiply(investment.getQuantity())
                .add(BigDecimal.valueOf(totalCost));
            investment.setQuantity(newQty);
            investment.setPurchasePrice(totalCostBd.divide(newQty, 2, java.math.RoundingMode.HALF_UP));
        } else {
            investment = UserInvestment.builder()
                .username(username).assetType(type).assetSymbol(symbol)
                .quantity(BigDecimal.valueOf(quantity))
                .purchasePrice(BigDecimal.valueOf(currentPrice))
                .purchaseDate(LocalDateTime.now())
                .build();
        }
        investmentRepository.save(investment);

        return Map.of(
            "message", "Compra realizada! " + quantity + " " + symbol + " por R$ " + String.format("%.2f", totalCost),
            "asset", symbol, "quantity", quantity, "totalCost", totalCost
        );
    }

    private double getCurrentPrice(String symbol, String type) {
        if ("CRYPTO".equals(type)) return cryptoPrices.getOrDefault(symbol, 0.0);
        return stockPrices.getOrDefault(symbol, 0.0);
    }

    @GetMapping("/prices")
    public Map<String, Object> getPrices() {
        return Map.of("crypto", cryptoPrices, "stocks", stockPrices);
    }
}
