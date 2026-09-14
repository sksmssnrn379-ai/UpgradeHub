package com.upgradehub.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String brand;

    private Long price;

    private Integer stock;

    private String category;

    private Integer performanceScore;   
    @Column
    private Double benchmarkScore;

    @Column(length = 50)
    private String benchmarkType;

    @Column(length = 100)
    private String benchmarkSource;

    @Column
    private LocalDate benchmarkUpdatedAt;
}