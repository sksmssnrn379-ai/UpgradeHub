package com.upgradehub.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailSenderService {

    private final JavaMailSender
            mailSender;

    @Value("${app.mail.from}")
    private String fromAddress;

    public void sendVerificationCode(
            String recipientEmail,
            String verificationCode
    ) {
        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setFrom(
                fromAddress
        );

        message.setTo(
                recipientEmail
        );

        message.setSubject(
                "[UpgradeHub] 이메일 인증번호"
        );

        message.setText(
                "UpgradeHub 회원가입 인증번호입니다.\n\n"
                        + verificationCode
                        + "\n\n"
                        + "인증번호는 5분 동안 유효합니다.\n"
                        + "본인이 요청하지 않았다면 이 메일을 무시해 주세요."
        );

        try {
            mailSender.send(
                    message
            );
        } catch (MailException exception) {
            throw new RuntimeException(
                    "인증 이메일을 전송하지 못했습니다.",
                    exception
            );
        }
    }
}