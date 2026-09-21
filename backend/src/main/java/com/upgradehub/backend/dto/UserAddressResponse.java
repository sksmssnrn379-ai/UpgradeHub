package com.upgradehub.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAddressResponse {

    private Long id;

    private String addressName;

    private String recipientName;

    private String phone;

    private String postalCode;

    private String roadAddress;

    private String detailAddress;

    private Boolean defaultAddress;
}