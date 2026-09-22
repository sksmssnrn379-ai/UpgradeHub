package com.upgradehub.backend.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailSenderService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromAddress;

    public void sendVerificationCode(
            String recipientEmail,
            String verificationCode
    ) {
        try {
            MimeMessage message =
                    mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(
                            message,
                            false,
                            "UTF-8"
                    );

            helper.setFrom(
                    fromAddress,
                    "UpgradeHub"
            );

            helper.setTo(
                    recipientEmail
            );

            helper.setSubject(
                    "[UpgradeHub] 이메일 인증번호"
            );

            helper.setText(
                    "UpgradeHub 회원가입 인증번호입니다.\n\n"
                            + verificationCode
                            + "\n\n"
                            + "인증번호는 5분 동안 유효합니다.\n"
                            + "본인이 요청하지 않았다면 이 메일을 무시해 주세요.",
                    false
            );

            mailSender.send(message);

        } catch (Exception exception) {
            throw new RuntimeException(
                    "인증 이메일을 전송하지 못했습니다.",
                    exception
            );
        }
    }
}