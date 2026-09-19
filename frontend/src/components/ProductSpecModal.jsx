import {
  Cpu,
  Ruler,
  Save,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import api from "../api/axios.js";

const EMPTY_SPEC = {
  cpuSocket: "",
  memoryType: "",
  powerConsumption: "",
  recommendedPower: "",
  powerCapacity: "",
  gpuInterface: "",
  storageInterface: "",
  widthMm: "",
  depthMm: "",
  heightMm: "",
  weightG: "",
  baseClockMhz: "",
  boostClockMhz: "",
  coreCount: "",
  threadCount: "",
};

function nullableText(value) {
  const normalized =
    String(value ?? "").trim();

  return normalized || null;
}

function nullableNumber(value) {
  if (
    value === "" ||
    value === null ||
    value === undefined
  ) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}

function ProductSpecModal({
  product,
  onClose,
  onSaved,
}) {
  const [form, setForm] =
    useState(EMPTY_SPEC);

  const [specExists, setSpecExists] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    async function loadSpec() {
    setLoading(true);
    setMessage("");

    try {
      const response =
        await api.get(
          `/products/${product.id}/spec`
        );

      const data =
        response.data || {};

      setForm({
        cpuSocket:
          data.cpuSocket ?? "",

        memoryType:
          data.memoryType ?? "",

        powerConsumption:
          data.powerConsumption ?? "",

        recommendedPower:
          data.recommendedPower ?? "",

        powerCapacity:
          data.powerCapacity ?? "",

        gpuInterface:
          data.gpuInterface ?? "",

        storageInterface:
          data.storageInterface ?? "",

        widthMm:
          data.widthMm ?? "",

        depthMm:
          data.depthMm ?? "",

        heightMm:
          data.heightMm ?? "",

        weightG:
          data.weightG ?? "",

        baseClockMhz:
          data.baseClockMhz ?? "",

        boostClockMhz:
          data.boostClockMhz ?? "",

        coreCount:
          data.coreCount ?? "",

        threadCount:
          data.threadCount ?? "",
      });

      setSpecExists(true);
    } catch (error) {
      const status =
        error.response?.status;

      const serverMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "";

      const specNotFound =
        status === 404 ||
        String(serverMessage).includes(
          "상품 사양을 찾을 수 없습니다"
        );

      if (specNotFound) {
        setForm({
          ...EMPTY_SPEC,
        });

        setSpecExists(false);
      } else {
        setMessage(
          serverMessage ||
            "상품 사양을 불러오지 못했습니다."
        );
      }
    } finally {
      setLoading(false);
    }
  }


    loadSpec();
  }, [product.id]);

  

  function updateField(
    field,
    value
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function validateForm() {
    const numericFields = [
      "powerConsumption",
      "recommendedPower",
      "powerCapacity",
      "widthMm",
      "depthMm",
      "heightMm",
      "weightG",
      "baseClockMhz",
      "boostClockMhz",
      "coreCount",
      "threadCount",
    ];

    for (
      const field of numericFields
    ) {
      const value = form[field];

      if (
        value !== "" &&
        Number(value) < 0
      ) {
        setMessage(
          "숫자 규격은 0 이상이어야 합니다."
        );

        return false;
      }
    }

    if (
      form.coreCount !== "" &&
      !Number.isInteger(
        Number(form.coreCount)
      )
    ) {
      setMessage(
        "코어 수는 정수여야 합니다."
      );

      return false;
    }

    if (
      form.threadCount !== "" &&
      !Number.isInteger(
        Number(form.threadCount)
      )
    ) {
      setMessage(
        "스레드 수는 정수여야 합니다."
      );

      return false;
    }

    return true;
  }

  async function saveSpec(event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload = {
      cpuSocket:
        nullableText(
          form.cpuSocket
        ),

      memoryType:
        nullableText(
          form.memoryType
        ),

      powerConsumption:
        nullableNumber(
          form.powerConsumption
        ),

      recommendedPower:
        nullableNumber(
          form.recommendedPower
        ),

      powerCapacity:
        nullableNumber(
          form.powerCapacity
        ),

      gpuInterface:
        nullableText(
          form.gpuInterface
        ),

      storageInterface:
        nullableText(
          form.storageInterface
        ),

      widthMm:
        nullableNumber(
          form.widthMm
        ),

      depthMm:
        nullableNumber(
          form.depthMm
        ),

      heightMm:
        nullableNumber(
          form.heightMm
        ),

      weightG:
        nullableNumber(
          form.weightG
        ),

      baseClockMhz:
        nullableNumber(
          form.baseClockMhz
        ),

      boostClockMhz:
        nullableNumber(
          form.boostClockMhz
        ),

      coreCount:
        nullableNumber(
          form.coreCount
        ),

      threadCount:
        nullableNumber(
          form.threadCount
        ),
    };

    setSaving(true);
    setMessage("");

    try {
      if (specExists) {
        await api.put(
          `/products/${product.id}/spec`,
          payload
        );
      } else {
        await api.post(
          `/products/${product.id}/spec`,
          payload
        );
      }

      if (onSaved) {
        onSaved();
      }

      onClose();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "상품 사양을 저장하지 못했습니다."
      );
    } finally {
      setSaving(false);
    }
  }

  function renderNumberInput(
    label,
    field,
    unit,
    step = "1"
  ) {
    return (
      <label className="space-y-2">
        <span className="text-sm font-bold text-slate-300">
          {label}
        </span>

        <div className="relative">
          <input
            type="number"
            min="0"
            step={step}
            value={form[field]}
            onChange={(event) => {
              updateField(
                field,
                event.target.value
              );
            }}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-16 text-white outline-none focus:border-cyan-500"
          />

          <span className="absolute right-4 top-3 text-sm text-slate-500">
            {unit}
          </span>
        </div>
      </label>
    );
  }

  function renderTextInput(
    label,
    field,
    placeholder
  ) {
    return (
      <label className="space-y-2">
        <span className="text-sm font-bold text-slate-300">
          {label}
        </span>

        <input
          value={form[field]}
          onChange={(event) => {
            updateField(
              field,
              event.target.value
            );
          }}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
        />
      </label>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget &&
          !saving
        ) {
          onClose();
        }
      }}
    >
      <form
        onSubmit={saveSpec}
        className="my-8 w-full max-w-4xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold tracking-widest text-cyan-400">
              PRODUCT SPECIFICATION
            </p>

            <h2 className="mt-1 text-2xl font-black">
              상세 규격 관리
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              {product.name}
            </p>

            <p className="mt-1 text-xs text-slate-600">
              상품 ID {product.id}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="상세 규격 창 닫기"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
          >
            <X size={22} />
          </button>
        </header>

        {message && (
          <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {message}
          </div>
        )}

        {loading ? (
          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-14 text-center text-slate-400">
            상품 사양을 불러오는 중입니다.
          </div>
        ) : (
          <>
            <section className="mt-7">
              <div className="flex items-center gap-2">
                <Ruler
                  size={20}
                  className="text-cyan-400"
                />

                <h3 className="text-lg font-bold">
                  크기 및 무게
                </h3>
              </div>

              <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {renderNumberInput(
                  "가로",
                  "widthMm",
                  "mm",
                  "0.01"
                )}

                {renderNumberInput(
                  "세로",
                  "depthMm",
                  "mm",
                  "0.01"
                )}

                {renderNumberInput(
                  "높이",
                  "heightMm",
                  "mm",
                  "0.01"
                )}

                {renderNumberInput(
                  "무게",
                  "weightG",
                  "g",
                  "0.01"
                )}
              </div>
            </section>

            <section className="mt-8 border-t border-slate-800 pt-7">
              <div className="flex items-center gap-2">
                <Cpu
                  size={20}
                  className="text-violet-400"
                />

                <h3 className="text-lg font-bold">
                  클럭 및 프로세서
                </h3>
              </div>

              <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {renderNumberInput(
                  "기본 클럭",
                  "baseClockMhz",
                  "MHz"
                )}

                {renderNumberInput(
                  "최대 클럭",
                  "boostClockMhz",
                  "MHz"
                )}

                {renderNumberInput(
                  "코어 수",
                  "coreCount",
                  "개"
                )}

                {renderNumberInput(
                  "스레드 수",
                  "threadCount",
                  "개"
                )}
              </div>
            </section>

            <section className="mt-8 border-t border-slate-800 pt-7">
              <h3 className="text-lg font-bold">
                호환성 및 전력
              </h3>

              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                {renderTextInput(
                  "CPU 소켓",
                  "cpuSocket",
                  "예: AM4"
                )}

                {renderTextInput(
                  "메모리 타입",
                  "memoryType",
                  "예: DDR4"
                )}

                {renderTextInput(
                  "GPU 인터페이스",
                  "gpuInterface",
                  "예: PCIe 4.0 x16"
                )}

                {renderTextInput(
                  "저장장치 인터페이스",
                  "storageInterface",
                  "예: PCIe 4.0 NVMe"
                )}

                {renderNumberInput(
                  "소비전력",
                  "powerConsumption",
                  "W"
                )}

                {renderNumberInput(
                  "권장 파워",
                  "recommendedPower",
                  "W"
                )}

                {renderNumberInput(
                  "파워 용량",
                  "powerCapacity",
                  "W"
                )}
              </div>
            </section>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <p className="self-center text-sm text-slate-500">
                {specExists
                  ? "기존 사양을 수정합니다."
                  : "새 상품 사양을 등록합니다."}
              </p>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={saving}
                  className="rounded-xl border border-slate-700 px-5 py-3 font-bold text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
                >
                  취소
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-black text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save size={18} />

                  {saving
                    ? "저장 중..."
                    : "상세 규격 저장"}
                </button>
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

export default ProductSpecModal;