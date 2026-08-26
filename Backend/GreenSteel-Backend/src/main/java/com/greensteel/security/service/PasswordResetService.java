package com.greensteel.security.service;

import com.greensteel.security.entity.PasswordResetToken;
import com.greensteel.security.repository.PasswordResetTokenRepository;
import com.greensteel.user.entity.User;
import com.greensteel.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class PasswordResetService {
    private static final int TOKEN_BYTES = 32;
    private static final int EXPIRY_MINUTES = 30;
    private static final Logger log = LoggerFactory.getLogger(PasswordResetService.class);

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;
    private final Environment environment;
    private final Map<String, String> developmentResetLinks = new ConcurrentHashMap<>();

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @Value("${MAIL_FROM:${spring.mail.username:}}")
    private String mailFrom;

    @Transactional
    public void requestReset(String email) {
        userRepository.findByEmail(email.trim().toLowerCase()).ifPresent(user -> {
            tokenRepository.findAllByUserAndUsedFalse(user).forEach(previous -> previous.setUsed(true));
            String rawToken = generateToken();
            PasswordResetToken resetToken = tokenRepository.save(PasswordResetToken.builder()
                    .user(user)
                    .tokenHash(hash(rawToken))
                    .expiresAt(LocalDateTime.now().plusMinutes(EXPIRY_MINUTES))
                    .used(false)
                    .build());
            if (isDevelopment()) {
                developmentResetLinks.put(user.getEmail().trim().toLowerCase(), buildResetUrl(rawToken));
            }
            try {
                sendEmail(user, rawToken);
            } catch (MailException | IllegalArgumentException exception) {
                log.error("Password reset email could not be sent for a generated reset request (token omitted)", exception);
                if (!isDevelopment()) {
                    resetToken.setUsed(true);
                    tokenRepository.save(resetToken);
                }
            }
        });
    }

    @Transactional
    public void resetPassword(String rawToken, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByTokenHashAndUsedFalse(hash(rawToken))
                .filter(token -> token.getExpiresAt().isAfter(LocalDateTime.now()))
                .orElseThrow(() -> new IllegalArgumentException("This password reset link is invalid or has expired."));
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        resetToken.setUsed(true);
        tokenRepository.save(resetToken);
        developmentResetLinks.remove(user.getEmail());
    }

    public String getDevelopmentResetUrl(String email) {
        if (!isDevelopment()) {
            throw new IllegalStateException("Development reset links are disabled.");
        }
        return developmentResetLinks.get(email.trim().toLowerCase());
    }

    private void sendEmail(User user, String rawToken) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(mailFrom);
        message.setTo(user.getEmail());
        message.setSubject("Reset your GreenSteel password");
        message.setText("""
                Hello %s,

                We received a request to reset your GreenSteel password.

                Reset your password here:
                %s

                This link expires in 30 minutes.

                If you did not request this, you can safely ignore this email.

                GreenSteel
                """.formatted(user.getFirstName(), buildResetUrl(rawToken)));
        mailSender.send(message);
    }

    private String buildResetUrl(String rawToken) {
        return frontendUrl.replaceAll("/+$", "") + "/reset-password?token=" + rawToken;
    }

    private boolean isDevelopment() {
        return environment.acceptsProfiles(Profiles.of("dev"));
    }

    private String generateToken() {
        byte[] bytes = new byte[TOKEN_BYTES];
        new SecureRandom().nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hash(String value) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8));
            StringBuilder result = new StringBuilder(64);
            for (byte valueByte : digest) result.append(String.format("%02x", valueByte));
            return result.toString();
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("Unable to hash reset token", exception);
        }
    }
}
