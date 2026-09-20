package com.upgradehub.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "product_spec")
public class ProductSpec {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "product_id",
            nullable = false,
            unique = true
    )
    private Product product;

    @Column(name = "cpu_socket")
    private String cpuSocket;

    @Column(name = "memory_type")
    private String memoryType;

    @Column(name = "power_consumption")
    private Integer powerConsumption;

    @Column(name = "recommended_power")
    private Integer recommendedPower;

    @Column(name = "power_capacity")
    private Integer powerCapacity;

    @Column(name = "gpu_interface")
    private String gpuInterface;

    @Column(name = "storage_interface")
    private String storageInterface;

    @Column(
        name = "width_mm",
        precision = 10,
        scale = 2
    )
    private BigDecimal widthMm;

    @Column(
            name = "depth_mm",
            precision = 10,
            scale = 2
    )
    private BigDecimal depthMm;

    @Column(
            name = "height_mm",
            precision = 10,
            scale = 2
    )
    private BigDecimal heightMm;

    @Column(
            name = "weight_g",
            precision = 10,
            scale = 2
    )
    private BigDecimal weightG;

    @Column(
            name = "base_clock_mhz"
    )
    private Integer baseClockMhz;

    @Column(
            name = "boost_clock_mhz"
    )
    private Integer boostClockMhz;

    @Column(
            name = "core_count"
    )
    private Integer coreCount;

    @Column(
            name = "thread_count"
    )
    private Integer threadCount;
}
