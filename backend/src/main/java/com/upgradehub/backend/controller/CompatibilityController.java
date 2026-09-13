package com.upgradehub.backend.controller;

import com.upgradehub.backend.dto.CompatibilityResponse;
import com.upgradehub.backend.service.CompatibilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/compatibility")
@RequiredArgsConstructor
public class CompatibilityController {

    private final CompatibilityService compatibilityService;

    @GetMapping("/check")
    public CompatibilityResponse checkCompatibility(
            @RequestParam Long targetProductId,
            Principal principal
    ) {
        String email = principal.getName();

        return compatibilityService.checkCompatibility(
                email,
                targetProductId
        );
    }
}