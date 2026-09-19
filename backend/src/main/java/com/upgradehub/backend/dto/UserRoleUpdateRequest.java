package com.upgradehub.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserRoleUpdateRequest {

    @NotBlank(
            message = "변경할 권한을 입력해 주세요."
    )
    private String role;
}