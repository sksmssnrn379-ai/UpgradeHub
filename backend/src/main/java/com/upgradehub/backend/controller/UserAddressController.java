package com.upgradehub.backend.controller;

import com.upgradehub.backend.dto.UserAddressRequest;
import com.upgradehub.backend.dto.UserAddressResponse;
import com.upgradehub.backend.service.UserAddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/addresses")
@RequiredArgsConstructor
public class UserAddressController {

    private final UserAddressService
            userAddressService;

    @GetMapping
    public ResponseEntity<List<UserAddressResponse>>
    getAddresses(
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                userAddressService.getAddresses(
                        authentication.getName()
                )
        );
    }

    @GetMapping("/{addressId}")
    public ResponseEntity<UserAddressResponse>
    getAddress(
            Authentication authentication,
            @PathVariable Long addressId
    ) {
        return ResponseEntity.ok(
                userAddressService.getAddress(
                        authentication.getName(),
                        addressId
                )
        );
    }

    @PostMapping
    public ResponseEntity<UserAddressResponse>
    createAddress(
            Authentication authentication,
            @Valid @RequestBody
            UserAddressRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        userAddressService
                                .createAddress(
                                        authentication
                                                .getName(),
                                        request
                                )
                );
    }

    @PutMapping("/{addressId}")
    public ResponseEntity<UserAddressResponse>
    updateAddress(
            Authentication authentication,
            @PathVariable Long addressId,
            @Valid @RequestBody
            UserAddressRequest request
    ) {
        return ResponseEntity.ok(
                userAddressService.updateAddress(
                        authentication.getName(),
                        addressId,
                        request
                )
        );
    }

    @PutMapping("/{addressId}/default")
    public ResponseEntity<UserAddressResponse>
    setDefaultAddress(
            Authentication authentication,
            @PathVariable Long addressId
    ) {
        return ResponseEntity.ok(
                userAddressService
                        .setDefaultAddress(
                                authentication
                                        .getName(),
                                addressId
                        )
        );
    }

    @DeleteMapping("/{addressId}")
    public ResponseEntity<Void>
    deleteAddress(
            Authentication authentication,
            @PathVariable Long addressId
    ) {
        userAddressService.deleteAddress(
                authentication.getName(),
                addressId
        );

        return ResponseEntity.noContent()
                .build();
    }
}