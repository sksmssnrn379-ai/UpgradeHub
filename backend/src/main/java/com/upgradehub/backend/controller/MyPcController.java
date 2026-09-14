package com.upgradehub.backend.controller;

import com.upgradehub.backend.dto.MyPcPartRequest;
import com.upgradehub.backend.dto.PurchasedPartResponse;
import com.upgradehub.backend.entity.MyPc;
import com.upgradehub.backend.service.MyPcService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/mypc")
@RequiredArgsConstructor
public class MyPcController {

    private final MyPcService myPcService;

    /*
     * 로그인한 사용자의 MY PC 조회
     */
    @GetMapping("/me")
    public MyPc getMyPcByLoginUser(
            Principal principal
    ) {
        String email = principal.getName();

        return myPcService.getMyPcByEmail(email);
    }

    /*
     * 로그인한 사용자에게 MY PC 등록
     */
    @PostMapping("/me")
    public MyPc createMyPcForLoginUser(
            @RequestParam Long cpuId,
            @RequestParam Long gpuId,
            @RequestParam Long ramId,
            Principal principal
    ) {
        String email = principal.getName();

        return myPcService.createMyPc(
                email,
                cpuId,
                gpuId,
                ramId
        );
    }

    /*
     * MY PC ID로 조회
     * 숫자 경로만 허용
     */
    @GetMapping("/{id:\\d+}")
    public MyPc getMyPc(
            @PathVariable Long id
    ) {
        return myPcService.getMyPc(id);
    }

    /*
     * 로그인한 사용자가 구매한 부품 조회
     */
    @GetMapping("/purchased-parts")
    public List<PurchasedPartResponse> getPurchasedParts(
            Principal principal
    ) {
        String email = principal.getName();

        return myPcService.getPurchasedParts(email);
    }

    /*
     * 구매한 부품을 MY PC에 장착
     */
    @PutMapping("/parts")
    public MyPc installPurchasedPart(
            @Valid @RequestBody MyPcPartRequest request,
            Principal principal
    ) {
        String email = principal.getName();

        return myPcService.installPurchasedPart(
                email,
                request
        );
    }
}