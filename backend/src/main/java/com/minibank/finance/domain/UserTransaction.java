package com.minibank.finance.domain;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserTransaction {
    private Long id;
    private Long accountId;
    private String type;
    private BigDecimal amount;
    private String category;
    private String description;
    private LocalDateTime date;
    private LocalDate dueDate;
    private String status;
}
