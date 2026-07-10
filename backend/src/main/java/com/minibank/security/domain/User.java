package com.minibank.security.domain;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    private Long id;
    private String username;
    private String password;
    private UserRole role;
    private String fullName;
    private boolean active;
}
