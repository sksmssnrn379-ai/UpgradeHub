import {
  Image as ImageIcon,
  Pencil,
  Plus,
  RefreshCw,
  Ruler,
  Save,
  Search,
  X,
} from "lucide-react";

import ProductSpecModal from "../../components/ProductSpecModal.jsx";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "../../api/axios.js";

const EMPTY_FORM = {
  name: "",
  brand: "",
  category: "GPU",
  price: 0,
  stock: 0,
  imageUrl: "",
  benchmarkScore: "",
  benchmarkType: "",
  benchmarkSource: "",
  benchmarkUpdatedAt: "",
};

function AdminProductsPage() {
  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [changingId, setChangingId] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState("ALL");

  const [form, setForm] =
    useState(null);

  const [imageError, setImageError] =
    useState(false);
  const [
  specProduct,
  setSpecProduct,
  ] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    setMessage("");

    try {
      const response =
        await api.get(
          "/admin/products"
        );

      setProducts(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      if (
        error.response?.status === 401
      ) {
        setMessage(
          "로그인이 필요합니다."
        );
      } else if (
        error.response?.status === 403
      ) {
        setMessage(
          "관리자 권한이 없습니다."
        );
      } else {
        setMessage(
          error.response?.data
            ?.message ||
            "관리자 상품 목록을 불러오지 못했습니다."
        );
      }

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return products.filter(
        (product) => {
          const productName =
            String(
              product.name || ""
            ).toLowerCase();

          const productBrand =
            String(
              product.brand || ""
            ).toLowerCase();

          const matchesSearch =
            !normalizedSearch ||
            productName.includes(
              normalizedSearch
            ) ||
            productBrand.includes(
              normalizedSearch
            );

          const matchesCategory =
            categoryFilter === "ALL" ||
            product.category ===
              categoryFilter;

          return (
            matchesSearch &&
            matchesCategory
          );
        }
      );
    }, [
      products,
      search,
      categoryFilter,
    ]);

  function openCreateForm() {
    setForm({
      ...EMPTY_FORM,
    });

    setImageError(false);
    setMessage("");
  }

  function openEditForm(product) {
  setForm({
    id: product.id,
    name: product.name || "",
    brand: product.brand || "",
    category:
      product.category || "GPU",
    price:
      product.price ?? 0,
    stock:
      product.stock ?? 0,
    performanceScore:
      product.performanceScore ?? null,
    imageUrl:
      product.imageUrl || "",
    benchmarkScore:
      product.benchmarkScore ?? "",
    benchmarkType:
      product.benchmarkType || "",
    benchmarkSource:
      product.benchmarkSource || "",
    benchmarkUpdatedAt:
      product.benchmarkUpdatedAt || "",
  });

  setImageError(false);
  setMessage("");
}

  function closeForm() {
    if (saving) {
      return;
    }

    setForm(null);
    setImageError(false);
  }

  function updateForm(
    field,
    value
  ) {
    setForm((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        [field]: value,
      };
    });

    if (field === "imageUrl") {
      setImageError(false);
    }
  }

  function validateForm() {
    if (!form) {
      return false;
    }

    if (!form.name.trim()) {
      setMessage(
        "상품명을 입력해 주세요."
      );

      setMessageType("error");
      return false;
    }

    if (!form.brand.trim()) {
      setMessage(
        "브랜드를 입력해 주세요."
      );

      setMessageType("error");
      return false;
    } 
    
    const price =
      Number(form.price);

    if (
      !Number.isFinite(price) ||
      price < 0
    ) {
      setMessage(
        "가격은 0 이상의 숫자여야 합니다."
      );

      setMessageType("error");
      return false;
    }

    const stock =
      Number(form.stock);

    if (
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      setMessage(
        "재고는 0 이상의 정수여야 합니다."
      );

      setMessageType("error");
      return false;
    }

    if (
  form.benchmarkScore !== ""
) {
  const benchmarkScore =
    Number(
      form.benchmarkScore
    );

  if (
    !Number.isFinite(
      benchmarkScore
    ) ||
    benchmarkScore < 0
  ) {
    setMessage(
      "원본 벤치마크 점수는 0 이상의 숫자여야 합니다."
    );

    setMessageType("error");
    return false;
  }
}

    return true;
  }

  async function saveProduct(
    event
  ) {
    event.preventDefault();

    if (!form) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    const payload = {
  name:
    form.name.trim(),

  brand:
    form.brand.trim(),

  category:
    form.category,

  price:
    Number(form.price),

  stock:
    Number(form.stock),

  imageUrl:
    form.imageUrl.trim() ||
    null,

  benchmarkScore:
    form.benchmarkScore === ""
      ? null
      : Number(
          form.benchmarkScore
        ),

  benchmarkType:
    form.benchmarkType.trim() ||
    null,

  benchmarkSource:
    form.benchmarkSource.trim() ||
    null,

  benchmarkUpdatedAt:
    form.benchmarkUpdatedAt ||
    null,
};

    setSaving(true);
    setMessage("");

    try {
      if (form.id) {
        await api.put(
          `/admin/products/${form.id}`,
          payload
        );

        setMessage(
          "상품이 수정되었습니다."
        );
      } else {
        await api.post(
          "/admin/products",
          payload
        );

        setMessage(
          "상품이 등록되었습니다."
        );
      }

      setMessageType("success");

      setForm(null);
      setImageError(false);

      await loadProducts();
    } catch (error) {
      if (
        error.response?.status === 401
      ) {
        setMessage(
          "로그인이 만료되었습니다. 다시 로그인해 주세요."
        );
      } else if (
        error.response?.status === 403
      ) {
        setMessage(
          "상품을 변경할 관리자 권한이 없습니다."
        );
      } else {
        setMessage(
          error.response?.data
            ?.message ||
            "상품을 저장하지 못했습니다."
        );
      }

      setMessageType("error");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(
    product
  ) {
    const isActive =
      product.active !== false;

    const confirmMessage =
      isActive
        ? "이 상품의 판매를 중지할까요?"
        : "이 상품의 판매를 다시 시작할까요?";

    if (
      !window.confirm(
        confirmMessage
      )
    ) {
      return;
    }

    setChangingId(product.id);
    setMessage("");

    try {
      await api.put(
        `/admin/products/${product.id}/active`
      );

      setMessage(
        isActive
          ? "상품 판매를 중지했습니다."
          : "상품 판매를 다시 시작했습니다."
      );

      setMessageType("success");

      await loadProducts();
    } catch (error) {
      if (
        error.response?.status === 401
      ) {
        setMessage(
          "로그인이 만료되었습니다. 다시 로그인해 주세요."
        );
      } else if (
        error.response?.status === 403
      ) {
        setMessage(
          "상품 상태를 변경할 관리자 권한이 없습니다."
        );
      } else {
        setMessage(
          error.response?.data
            ?.message ||
            "상품 상태를 변경하지 못했습니다."
        );
      }

      setMessageType("error");
    } finally {
      setChangingId(null);
    }
  }

  function formatPrice(price) {
    return Number(
      price || 0
    ).toLocaleString("ko-KR");
  }

  return (
    <div className="mx-auto max-w-7xl">
      {specProduct && (
  <ProductSpecModal
    product={specProduct}
    onClose={() => {
      setSpecProduct(null);
    }}
    onSaved={() => {
      setMessage(
        "상품 상세 규격이 저장되었습니다."
      );

      setMessageType("success");
    }}
  />
)}
      <section className="mb-7">
        <p className="text-sm font-bold tracking-widest text-cyan-400">
          PRODUCT MANAGEMENT
        </p>

        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-white">
              상품 관리
            </h1>

            <p className="mt-2 text-slate-400">
              상품 정보, 재고, 이미지와
              판매 상태를 관리합니다.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-black text-slate-950 transition hover:bg-cyan-400"
          >
            <Plus size={18} />

            상품 등록
          </button>
        </div>
      </section>

      {message && (
        <div
          className={
            "mb-6 rounded-xl border p-4 " +
            (messageType === "success"
              ? "border-green-500/30 bg-green-500/10 text-green-300"
              : "border-red-500/30 bg-red-500/10 text-red-300")
          }
        >
          {message}
        </div>
      )}

      <section className="mb-6 grid gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 md:grid-cols-[minmax(0,1fr)_220px_auto]">
        <label className="relative">
          <Search
            size={18}
            className="absolute left-3 top-3 text-slate-500"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(
                event.target.value
              );
            }}
            placeholder="상품명 또는 브랜드 검색"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500"
          />
        </label>

        <select
          value={categoryFilter}
          onChange={(event) => {
            setCategoryFilter(
              event.target.value
            );
          }}
          className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-white outline-none focus:border-cyan-500"
        >
          <option value="ALL">
            전체 카테고리
          </option>

          <option value="CPU">
            CPU
          </option>

          <option value="GPU">
            GPU
          </option>

          <option value="RAM">
            RAM
          </option>

          <option value="SSD">
            SSD
          </option>

          <option value="MOTHERBOARD">
            메인보드
          </option>

          <option value="POWER">
            파워
          </option>
        </select>

        <button
          type="button"
          onClick={loadProducts}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-slate-300 transition hover:border-cyan-500 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          새로고침
        </button>
      </section>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
        <span>
          전체 상품{" "}
          <strong className="text-white">
            {products.length}
          </strong>
          개
        </span>

        <span>
          검색 결과{" "}
          <strong className="text-cyan-400">
            {filteredProducts.length}
          </strong>
          개
        </span>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-16 text-center text-slate-400">
          상품 목록을 불러오는 중입니다.
        </div>
      ) : filteredProducts.length ===
        0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-16 text-center text-slate-400">
          조건에 맞는 상품이 없습니다.
        </div>
      ) : (
        <section className="grid gap-4">
          {filteredProducts.map(
            (product) => {
              const isActive =
                product.active !== false;

              const isChanging =
                changingId ===
                product.id;

              return (
                <article
                  key={product.id}
                  className="grid min-w-0 gap-5 rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700 md:grid-cols-[96px_minmax(0,1fr)_auto] md:items-center"
                >
                  <div className="flex h-24 w-full items-center justify-center overflow-hidden rounded-xl bg-slate-800 md:w-24">
                    {product.imageUrl ? (
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.style.display = "none";
                            }}
                            className="h-full w-full object-contain p-2"
                        />
                        ) : (
                      <ImageIcon
                        size={34}
                        className="text-slate-600"
                      />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-300">
                        {product.category}
                      </span>

                      <span
                        className={
                          "rounded-full px-3 py-1 text-xs font-bold " +
                          (isActive
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400")
                        }
                      >
                        {isActive
                          ? "판매 중"
                          : "판매 중지"}
                      </span>

                      <span className="text-xs text-slate-600">
                        ID {product.id}
                      </span>
                    </div>

                    <h2 className="mt-3 break-words text-xl font-bold text-white">
                      {product.name}
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                      {product.brand}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                      <span>
                        가격{" "}
                        <strong className="text-cyan-400">
                          {formatPrice(
                            product.price
                          )}
                          원
                        </strong>
                      </span>

                      <span>
                        재고{" "}
                        <strong
                          className={
                            Number(
                              product.stock
                            ) <= 5
                              ? "text-amber-400"
                              : "text-white"
                          }
                        >
                          {product.stock}개
                        </strong>
                      </span>

                      <span>
  계산된 성능 점수{" "}
  <strong>
    {product.performanceScore != null
      ? `${product.performanceScore} / 100`
      : "정보 없음"}
  </strong>
</span>
                      <span>
  원본 벤치마크{" "}
  <strong className="text-violet-300">
    {product.benchmarkScore != null
      ? Number(
          product.benchmarkScore
        ).toLocaleString("ko-KR")
      : "정보 없음"}
  </strong>
</span>
                    </div>

                    {product.imageUrl && (
                      <p className="mt-3 truncate text-xs text-slate-600">
                        {product.imageUrl}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 md:justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        openEditForm(
                          product
                        );
                      }}
                      className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 font-bold text-slate-300 transition hover:border-cyan-500 hover:text-cyan-400"
                    >
                      <Pencil size={16} />

                      수정
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSpecProduct(product);
                      }}
                      className="flex items-center gap-2 rounded-xl border border-cyan-500/30 px-4 py-2.5 font-bold text-cyan-300 transition hover:bg-cyan-500/10"
                    >
                      <Ruler size={16} />
                      상세 규격
                    </button>  
                    <button
                      type="button"
                      disabled={isChanging}
                      onClick={() => {
                        toggleActive(
                          product
                        );
                      }}
                      className={
                        "rounded-xl border px-4 py-2.5 font-bold transition disabled:cursor-not-allowed disabled:opacity-50 " +
                        (isActive
                          ? "border-red-500/30 text-red-300 hover:bg-red-500/10"
                          : "border-green-500/30 text-green-300 hover:bg-green-500/10")
                      }
                    >
                      {isChanging
                        ? "변경 중..."
                        : isActive
                          ? "판매 중지"
                          : "판매 재개"}
                    </button>
                  </div>
                </article>
              );
            }
          )}
        </section>
      )}

      {form && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeForm();
            }
          }}
        >
          <form
            onSubmit={saveProduct}
            className="my-8 w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold tracking-widest text-cyan-400">
                  PRODUCT FORM
                </p>

                <h2 className="mt-1 text-2xl font-black">
                  {form.id
                    ? "상품 수정"
                    : "상품 등록"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                aria-label="상품 입력 창 닫기"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
              >
                <X size={22} />
              </button>
            </div>

            {form.id && (
              <div className="mt-5 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-400">
                수정 중인 상품 ID:{" "}
                <strong className="text-white">
                  {form.id}
                </strong>
              </div>
            )}

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-300">
                  상품명
                </span>

                <input
                  value={form.name}
                  onChange={(event) => {
                    updateForm(
                      "name",
                      event.target.value
                    );
                  }}
                  placeholder="상품명을 입력하세요."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
                  required
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-300">
                  브랜드
                </span>

                <input
                  value={form.brand}
                  onChange={(event) => {
                    updateForm(
                      "brand",
                      event.target.value
                    );
                  }}
                  placeholder="브랜드를 입력하세요."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
                  required
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-300">
                  카테고리
                </span>

                <select
                  value={form.category}
                  onChange={(event) => {
                    updateForm(
                      "category",
                      event.target.value
                    );
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
                >
                  <option value="CPU">
                    CPU
                  </option>

                  <option value="GPU">
                    GPU
                  </option>

                  <option value="RAM">
                    RAM
                  </option>

                  <option value="SSD">
                    SSD
                  </option>

                  <option value="MOTHERBOARD">
                    메인보드
                  </option>

                  <option value="POWER">
                    파워
                  </option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-300">
                  가격
                </span>

                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.price}
                  onChange={(event) => {
                    updateForm(
                      "price",
                      event.target.value
                    );
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
                  required
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-300">
                  재고
                </span>

                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={(event) => {
                    updateForm(
                      "stock",
                      event.target.value
                    );
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
                  required
                />
              </label>

              <label className="space-y-2">
                <div className="space-y-2">
  <span className="text-sm font-bold text-slate-300">
    계산된 성능 점수
  </span>

  <div className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-300">
    {form.performanceScore != null
      ? `${form.performanceScore} / 100`
      : "벤치마크 저장 후 계산됩니다."}
  </div>

  <p className="text-xs text-slate-500">
    원본 벤치마크 점수를 기준으로 서버에서 계산됩니다.
  </p>
</div>
              </label>
              <label className="space-y-2">
  <span className="text-sm font-bold text-slate-300">
    원본 벤치마크 점수
  </span>

  <input
    type="number"
    min="0"
    step="0.01"
    value={form.benchmarkScore}
    onChange={(event) => {
      updateForm(
        "benchmarkScore",
        event.target.value
      );
    }}
    placeholder="예: 21500"
    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
  />
</label>

<label className="space-y-2">
  <span className="text-sm font-bold text-slate-300">
    벤치마크 유형
  </span>

  <select
    value={form.benchmarkType}
    onChange={(event) => {
      updateForm(
        "benchmarkType",
        event.target.value
      );
    }}
    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
  >
    <option value="">
      벤치마크 유형 선택
    </option>

    <option value="CPU_MULTI_CORE">
      CPU 멀티코어
    </option>

    <option value="CPU_SINGLE_CORE">
      CPU 싱글코어
    </option>

    <option value="CPU_MARK">
      CPU 종합 성능
    </option>

    <option value="GPU_RELATIVE_PERFORMANCE">
      GPU 상대 성능
    </option>

    <option value="GPU_GAMING_1440P">
      GPU 1440p 게이밍
    </option>

    <option value="GPU_GAMING_4K">
      GPU 4K 게이밍
    </option>
  </select>
</label>

<label className="space-y-2">
  <span className="text-sm font-bold text-slate-300">
    벤치마크 출처
  </span>

  <input
    value={form.benchmarkSource}
    onChange={(event) => {
      updateForm(
        "benchmarkSource",
        event.target.value
      );
    }}
    placeholder="예: PassMark, 제조사 자료"
    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
  />
</label>

<label className="space-y-2">
  <span className="text-sm font-bold text-slate-300">
    벤치마크 기준일
  </span>

  <input
    type="date"
    value={form.benchmarkUpdatedAt}
    onChange={(event) => {
      updateForm(
        "benchmarkUpdatedAt",
        event.target.value
      );
    }}
    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
  />
</label>
              <label className="space-y-2 sm:col-span-2">
                <span className="text-sm font-bold text-slate-300">
                  이미지 경로
                </span>

                <input
                  value={form.imageUrl}
                  onChange={(event) => {
                    updateForm(
                      "imageUrl",
                      event.target.value
                    );
                  }}
                  placeholder="/images/products/gpu/rtx-5070.webp"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
                />

                <p className="text-xs leading-5 text-slate-500">
                  frontend/public 폴더에
                  저장한 이미지의 상대 경로를
                  입력하세요.
                </p>

                <p className="text-xs leading-5 text-slate-500">
                  예:
                  /images/products/gpu/rtx-5070.webp
                </p>
              </label>
            </div>

            <div className="mt-6">
              <p className="mb-2 text-sm font-bold text-slate-300">
                이미지 미리보기
              </p>

              <div className="flex h-56 items-center justify-center overflow-hidden rounded-xl border border-slate-700 bg-slate-950">
                {form.imageUrl && !imageError ? (
  <img
    src={form.imageUrl}
    alt={form.name || "상품 이미지"}
    onError={() => {
      setImageError(true);
    }}
    className="h-full w-full object-contain p-4"
  />
) : (
  <div className="px-5 text-center text-slate-500">
    <ImageIcon
      size={44}
      className="mx-auto"
    />

    <p className="mt-3">
      {imageError
        ? "이미지를 불러올 수 없습니다."
        : "이미지 경로를 입력하세요."}
    </p>

    {imageError && (
      <p className="mt-2 break-all text-xs text-red-300">
        {form.imageUrl}
      </p>
    )}
  </div>
)}
              </div>
            </div>

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-xl border border-slate-700 px-5 py-3 font-bold text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
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
                  : "저장"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminProductsPage;