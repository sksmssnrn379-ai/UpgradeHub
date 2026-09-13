package com.upgradehub.backend.controller;

import com.upgradehub.backend.dto.AiRecommendationRequest;
import com.upgradehub.backend.dto.AiRecommendationResponse;
import com.upgradehub.backend.service.AiRecommendationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
public class AiRecommendationController {

    private final AiRecommendationService aiRecommendationService;

    @PostMapping("/recommend")
    public AiRecommendationResponse recommend(
            @Valid @RequestBody AiRecommendationRequest request,
            Principal principal
    ) {
        String email = principal.getName();

        return aiRecommendationService.recommend(
                email,
                request
        );
    }
}