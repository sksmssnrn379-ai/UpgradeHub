package com.upgradehub.backend.controller;

import com.upgradehub.backend.dto.CompareResponse;
import com.upgradehub.backend.service.CompareService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/compare")
@RequiredArgsConstructor
public class CompareController {

    private final CompareService compareService;

    @GetMapping
    public Map<String, Object> compare(
            @RequestParam Long currentId,
            @RequestParam Long targetId
    ) {

        return compareService.compare(
                currentId,
                targetId
        );
    }

    @GetMapping("/mypc")
    public Map<String, Object> compareMyPc(
            @RequestParam Long myPcId,
            @RequestParam Long targetId
    ) {

        return compareService.compareWithMyPc(
                myPcId,
                targetId
        );
    }

    @GetMapping("/me")
    public CompareResponse compareLoginUser(
            @RequestParam Long targetId,
            Principal principal
    ) {

        String email = principal.getName();

        return compareService.compareLoginUser(
                email,
                targetId
        );
    }
}