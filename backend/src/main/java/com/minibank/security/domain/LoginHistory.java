package com.minibank.security.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "login_history")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class LoginHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private LocalDateTime loginTime;

    @Column
    private String ipAddress;

    @Column
    private boolean success;

    @PrePersist
    protected void onCreate() {
        if (loginTime == null) loginTime = LocalDateTime.now();
    }
}
