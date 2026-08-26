package com.greensteel.security.repository;

import com.greensteel.security.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;
import com.greensteel.user.entity.User;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByTokenHashAndUsedFalse(String tokenHash);
    List<PasswordResetToken> findAllByUserAndUsedFalse(User user);
}
