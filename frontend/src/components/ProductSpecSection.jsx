import {
  Box,
  Cpu,
  Gauge,
  Ruler,
  Scale,
  Zap,
} from "lucide-react";

function formatNumber(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return null;
  }

  return number.toLocaleString(
    "ko-KR",
    {
      maximumFractionDigits: 2,
    }
  );
}

function formatClock(value) {
  const mhz = Number(value);

  if (
    !Number.isFinite(mhz) ||
    mhz <= 0
  ) {
    return "-";
  }

  if (mhz >= 1000) {
    const ghz = mhz / 1000;

    return `${ghz.toLocaleString(
      "ko-KR",
      {
        minimumFractionDigits: 1,
        maximumFractionDigits: 2,
      }
    )} GHz`;
  }

  return `${formatNumber(mhz)} MHz`;
}

function formatDimensions(spec) {
  const dimensions = [
    spec?.widthMm,
    spec?.depthMm,
    spec?.heightMm,
  ];

  if (
    dimensions.every(
      (value) =>
        value === null ||
        value === undefined ||
        value === ""
    )
  ) {
    return "-";
  }

  const formatted =
    dimensions.map((value) => {
      const result =
        formatNumber(value);

      return result ?? "-";
    });

  return `${formatted.join(
    " x "
  )} mm`;
}

function SpecCard({
  icon: Icon,
  label,
  value,
  accent = "text-cyan-400",
}) {
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-950 p-4">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Icon
          size={17}
          className={accent}
        />

        {label}
      </div>

      <p className="mt-3 break-words text-lg font-bold text-white">
        {value}
      </p>
    </article>
  );
}

function ProductSpecSection({
  spec,
  loading = false,
}) {
  if (loading) {
    return (
      <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
        상세 규격을 불러오는 중입니다.
      </section>
    );
  }

  if (!spec) {
    return (
      <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-500">
        등록된 상세 규격이 없습니다.
      </section>
    );
  }

  const cards = [
    {
      label: "크기",
      value:
        formatDimensions(spec),
      icon: Ruler,
    },
    {
      label: "무게",
      value:
        spec.weightG != null
          ? `${formatNumber(
              spec.weightG
            )} g`
          : "-",
      icon: Scale,
    },
    {
      label: "기본 클럭",
      value:
        formatClock(
          spec.baseClockMhz
        ),
      icon: Gauge,
      accent: "text-violet-400",
    },
    {
      label: "최대 클럭",
      value:
        formatClock(
          spec.boostClockMhz
        ),
      icon: Zap,
      accent: "text-amber-400",
    },
    {
      label:
        spec.category === "GPU"
          ? "연산 코어"
          : "코어 수",
      value:
        spec.coreCount != null
          ? `${formatNumber(
              spec.coreCount
            )}개`
          : "-",
      icon: Cpu,
      accent: "text-violet-400",
    },
    {
      label: "스레드 수",
      value:
        spec.threadCount != null
          ? `${formatNumber(
              spec.threadCount
            )}개`
          : "-",
      icon: Cpu,
      accent: "text-cyan-400",
    },
  ];

  const compatibilityRows = [
    {
      label: "CPU 소켓",
      value: spec.cpuSocket,
    },
    {
      label: "메모리 타입",
      value: spec.memoryType,
    },
    {
      label: "GPU 인터페이스",
      value: spec.gpuInterface,
    },
    {
      label: "저장장치 인터페이스",
      value:
        spec.storageInterface,
    },
    {
      label: "소비전력",
      value:
        spec.powerConsumption != null
          ? `${spec.powerConsumption} W`
          : null,
    },
    {
      label: "권장 파워",
      value:
        spec.recommendedPower != null
          ? `${spec.recommendedPower} W`
          : null,
    },
    {
      label: "파워 용량",
      value:
        spec.powerCapacity != null
          ? `${spec.powerCapacity} W`
          : null,
    },
  ].filter(
    (item) =>
      item.value !== null &&
      item.value !== undefined &&
      item.value !== ""
  );

  return (
    <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-7">
      <div className="flex items-center gap-3">
        <Box
          size={24}
          className="text-cyan-400"
        />

        <div>
          <h2 className="text-2xl font-black">
            상세 규격
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            제품 크기와 성능 정보를
            확인하세요.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <SpecCard
            key={card.label}
            icon={card.icon}
            label={card.label}
            value={card.value}
            accent={card.accent}
          />
        ))}
      </div>

      {compatibilityRows.length >
        0 && (
        <div className="mt-8 border-t border-slate-800 pt-6">
          <h3 className="text-lg font-bold">
            호환성 및 전력
          </h3>

          <dl className="mt-4 divide-y divide-slate-800 rounded-xl border border-slate-800 bg-slate-950 px-4">
            {compatibilityRows.map(
              (item) => (
                <div
                  key={item.label}
                  className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <dt className="text-sm text-slate-400">
                    {item.label}
                  </dt>

                  <dd className="font-bold text-white">
                    {item.value}
                  </dd>
                </div>
              )
            )}
          </dl>
        </div>
      )}
    </section>
  );
}

export default ProductSpecSection;