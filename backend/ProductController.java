package com.upgradehub.backend;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @GetMapping
    public String hello() {
        return "UpgradeHub API 정상 작동!";
    }
}