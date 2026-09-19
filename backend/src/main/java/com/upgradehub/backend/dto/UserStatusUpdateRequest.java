package com.upgradehub.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserStatusUpdateRequest {

    @NotBlank(
            message = "변경할 상태를 입력해 주세요."
    )
    private String status;
}