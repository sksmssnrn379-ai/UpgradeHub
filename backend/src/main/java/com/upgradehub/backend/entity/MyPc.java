package com.upgradehub.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyPc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private User user;

    @ManyToOne
    private Product cpu;

    @ManyToOne
    private Product gpu;

    @ManyToOne
    private Product ram;

    @ManyToOne
    private Product ssd;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "motherboard_id")
    private Product motherboard;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "power_id")
    private Product power;
}