package com.upgradehub.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserAddressRequest {

    @NotBlank(
            message = "배송지 이름을 입력해 주세요."
    )
    @Size(max = 50)
    private String addressName;

    @NotBlank(
            message = "받는 사람 이름을 입력해 주세요."
    )
    @Size(max = 50)
    private String recipientName;

    @NotBlank(
            message = "전화번호를 입력해 주세요."
    )
    @Pattern(
            regexp = "^[0-9-]{9,20}$",
            message = "전화번호 형식이 올바르지 않습니다."
    )
    private String phone;

    @NotBlank(
            message = "우편번호를 입력해 주세요."
    )
    @Pattern(
            regexp = "^[0-9]{5}$",
            message = "우편번호는 숫자 5자리여야 합니다."
    )
    private String postalCode;

    @NotBlank(
            message = "도로명 주소를 입력해 주세요."
    )
    @Size(max = 255)
    private String roadAddress;

    @Size(max = 255)
    private String detailAddress;

    private Boolean defaultAddress;
}