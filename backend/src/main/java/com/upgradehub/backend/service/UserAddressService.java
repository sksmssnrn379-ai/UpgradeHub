package com.upgradehub.backend.service;

import com.upgradehub.backend.dto.UserAddressRequest;
import com.upgradehub.backend.dto.UserAddressResponse;
import com.upgradehub.backend.entity.User;
import com.upgradehub.backend.entity.UserAddress;
import com.upgradehub.backend.repository.UserAddressRepository;
import com.upgradehub.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserAddressService {

    private final UserRepository
            userRepository;

    private final UserAddressRepository
            userAddressRepository;

    @Transactional(readOnly = true)
    public List<UserAddressResponse> getAddresses(
            String email
    ) {
        User user = findUser(email);

        return userAddressRepository
                .findByUserIdOrderByDefaultAddressDescIdDesc(
                        user.getId()
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public UserAddressResponse getAddress(
            String email,
            Long addressId
    ) {
        User user = findUser(email);

        UserAddress address =
                findUserAddress(
                        user.getId(),
                        addressId
                );

        return toResponse(address);
    }

    public UserAddressResponse createAddress(
            String email,
            UserAddressRequest request
    ) {
        User user = findUser(email);

        boolean firstAddress =
                userAddressRepository
                        .countByUserId(
                                user.getId()
                        ) == 0;

        boolean makeDefault =
                firstAddress
                        || Boolean.TRUE.equals(
                                request.getDefaultAddress()
                        );

        if (makeDefault) {
            clearDefaultAddress(
                    user.getId()
            );
        }

        UserAddress address =
                UserAddress.builder()
                        .user(user)
                        .addressName(
                                request.getAddressName()
                                        .trim()
                        )
                        .recipientName(
                                request.getRecipientName()
                                        .trim()
                        )
                        .phone(
                                request.getPhone()
                                        .trim()
                        )
                        .postalCode(
                                request.getPostalCode()
                                        .trim()
                        )
                        .roadAddress(
                                request.getRoadAddress()
                                        .trim()
                        )
                        .detailAddress(
                                normalizeNullableText(
                                        request.getDetailAddress()
                                )
                        )
                        .defaultAddress(
                                makeDefault
                        )
                        .createdAt(
                                LocalDateTime.now()
                        )
                        .updatedAt(
                                LocalDateTime.now()
                        )
                        .build();

        return toResponse(
                userAddressRepository.save(
                        address
                )
        );
    }

    public UserAddressResponse updateAddress(
            String email,
            Long addressId,
            UserAddressRequest request
    ) {
        User user = findUser(email);

        UserAddress address =
                findUserAddress(
                        user.getId(),
                        addressId
                );

        boolean makeDefault =
                Boolean.TRUE.equals(
                        request.getDefaultAddress()
                );

        if (makeDefault) {
            clearDefaultAddress(
                    user.getId()
            );
        }

        address.setAddressName(
                request.getAddressName()
                        .trim()
        );

        address.setRecipientName(
                request.getRecipientName()
                        .trim()
        );

        address.setPhone(
                request.getPhone()
                        .trim()
        );

        address.setPostalCode(
                request.getPostalCode()
                        .trim()
        );

        address.setRoadAddress(
                request.getRoadAddress()
                        .trim()
        );

        address.setDetailAddress(
                normalizeNullableText(
                        request.getDetailAddress()
                )
        );

        address.setDefaultAddress(
                makeDefault
                        || Boolean.TRUE.equals(
                                address.getDefaultAddress()
                        )
        );

        address.setUpdatedAt(
                LocalDateTime.now()
        );

        return toResponse(
                userAddressRepository.save(
                        address
                )
        );
    }

    public UserAddressResponse setDefaultAddress(
            String email,
            Long addressId
    ) {
        User user = findUser(email);

        UserAddress address =
                findUserAddress(
                        user.getId(),
                        addressId
                );

        clearDefaultAddress(
                user.getId()
        );

        address.setDefaultAddress(true);
        address.setUpdatedAt(
                LocalDateTime.now()
        );

        return toResponse(
                userAddressRepository.save(
                        address
                )
        );
    }

    public void deleteAddress(
            String email,
            Long addressId
    ) {
        User user = findUser(email);

        UserAddress address =
                findUserAddress(
                        user.getId(),
                        addressId
                );

        boolean wasDefault =
                Boolean.TRUE.equals(
                        address.getDefaultAddress()
                );

        userAddressRepository.delete(
                address
        );

        userAddressRepository.flush();

        if (wasDefault) {
            List<UserAddress> remaining =
                    userAddressRepository
                            .findByUserIdOrderByDefaultAddressDescIdDesc(
                                    user.getId()
                            );

            if (!remaining.isEmpty()) {
                UserAddress nextDefault =
                        remaining.get(0);

                nextDefault.setDefaultAddress(
                        true
                );

                nextDefault.setUpdatedAt(
                        LocalDateTime.now()
                );

                userAddressRepository.save(
                        nextDefault
                );
            }
        }
    }

    private void clearDefaultAddress(
            Long userId
    ) {
        userAddressRepository
                .findByUserIdAndDefaultAddressTrue(
                        userId
                )
                .ifPresent(
                        address -> {
                            address.setDefaultAddress(
                                    false
                            );

                            address.setUpdatedAt(
                                    LocalDateTime.now()
                            );

                            userAddressRepository.save(
                                    address
                            );
                        }
                );
    }

    private User findUser(
            String email
    ) {
        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "사용자를 찾을 수 없습니다."
                        )
                );
    }

    private UserAddress findUserAddress(
            Long userId,
            Long addressId
    ) {
        return userAddressRepository
                .findByIdAndUserId(
                        addressId,
                        userId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "배송지를 찾을 수 없습니다."
                        )
                );
    }

    private String normalizeNullableText(
            String value
    ) {
        if (
                value == null
                        || value.isBlank()
        ) {
            return null;
        }

        return value.trim();
    }

    private UserAddressResponse toResponse(
            UserAddress address
    ) {
        return UserAddressResponse
                .builder()
                .id(
                        address.getId()
                )
                .addressName(
                        address.getAddressName()
                )
                .recipientName(
                        address.getRecipientName()
                )
                .phone(
                        address.getPhone()
                )
                .postalCode(
                        address.getPostalCode()
                )
                .roadAddress(
                        address.getRoadAddress()
                )
                .detailAddress(
                        address.getDetailAddress()
                )
                .defaultAddress(
                        address.getDefaultAddress()
                )
                .build();
    }
}