package com.upgradehub.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class EmailVerificationConfirmRequest {

    @NotBlank(
            message = "이메일을 입력해 주세요."
    )
    @Email(
            message = "이메일 형식이 올바르지 않습니다."
    )
    private String email;

    @NotBlank(
            message = "인증번호를 입력해 주세요."
    )
    @Pattern(
            regexp = "^[0-9]{6}$",
            message = "인증번호는 숫자 6자리여야 합니다."
    )
    private String code;
}