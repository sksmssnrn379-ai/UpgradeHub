package com.upgradehub.backend.controller;

import com.upgradehub.backend.service.PerformanceScoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/performance-scores")
@RequiredArgsConstructor
public class PerformanceScoreController {

    private final PerformanceScoreService
            performanceScoreService;

    @PostMapping("/recalculate")
    public ResponseEntity<Void>
    recalculatePerformanceScores() {

        performanceScoreService.recalculateAll();

        return ResponseEntity
                .noContent()
                .build();
    }
}