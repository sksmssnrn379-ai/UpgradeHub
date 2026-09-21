import {
  CircuitBoard,
  Cpu,
  HardDrive,
  MemoryStick,
  Monitor,
  RefreshCw,
  Search,
  ShoppingCart,
  Zap,
} from "lucide-react";
import {
  handleProductImageError,
} from "../utils/productImage.js";
import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import api from "../api/axios.js";

const categoryOptions = [
  {
    value: "ALL",
    label: "전체",
    icon: CircuitBoard,
  },
  {
    value: "GPU",
    label: "그래픽카드",
    icon: Monitor,
  },
  {
    value: "CPU",
    label: "프로세서",
    icon: Cpu,
  },
  {
    value: "RAM",
    label: "메모리",
    icon: MemoryStick,
  },
  {
    value: "SSD",
    label: "스토리지",
    icon: HardDrive,
  },
  {
    value: "MOTHERBOARD",
    label: "메인보드",
    icon: CircuitBoard,
  },
  {
    value: "POWER",
    label: "파워서플라이",
    icon: Zap,
  },
];

function ProductsPage() {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] =
    useSearchParams();

  const categoryFromUrl =
    searchParams.get("category") || "ALL";

  const keywordFromUrl =
    searchParams.get("keyword") || "";

  const [products, setProducts] = useState([]);

  const [selectedCategory, setSelectedCategory] =
    useState(categoryFromUrl);

  const [keyword, setKeyword] =
    useState(keywordFromUrl);

  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      setLoading(true);
      setMessage("");

      const requestParams = {};

      if (keywordFromUrl.trim()) {
        requestParams.keyword =
          keywordFromUrl.trim();
      }

      if (
        categoryFromUrl &&
        categoryFromUrl !== "ALL"
      ) {
        requestParams.category =
          categoryFromUrl;
      }

      try {
        const response = await api.get(
          "/products",
          {
            params: requestParams,
          }
        );

        if (active) {
          setProducts(response.data);
        }
      } catch (error) {
        if (!active) {
          return;
        }

        setMessage(
          error.response?.data?.message ||
            "상품 목록을 불러오지 못했습니다."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, [categoryFromUrl, keywordFromUrl]);

  function handleSearch(event) {
    event.preventDefault();

    const nextParams = {};

    if (keyword.trim()) {
      nextParams.keyword = keyword.trim();
    }

    if (
      selectedCategory &&
      selectedCategory !== "ALL"
    ) {
      nextParams.category =
        selectedCategory;
    }

    setSearchParams(nextParams);
  }

  function handleCategoryChange(category) {
    setSelectedCategory(category);

    const nextParams = {};

    if (keyword.trim()) {
      nextParams.keyword = keyword.trim();
    }

    if (category !== "ALL") {
      nextParams.category = category;
    }

    setSearchParams(nextParams);
  }

  function resetSearch() {
    setKeyword("");
    setSelectedCategory("ALL");
    setSearchParams({});
  }

  function refreshProducts() {
    const currentParams = {};

    if (keywordFromUrl.trim()) {
      currentParams.keyword =
        keywordFromUrl.trim();
    }

    if (categoryFromUrl !== "ALL") {
      currentParams.category =
        categoryFromUrl;
    }

    setSearchParams({
      ...currentParams,
      refresh: String(Date.now()),
    });
  }

  function handleCart() {
    if (!localStorage.getItem("token")) {
      navigate("/login", {
        state: {
          from: "/cart",
        },
      });

      return;
    }

    navigate("/cart");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/home");
  }

  function formatPrice(price) {
    return (
      Number(price || 0).toLocaleString(
        "ko-KR"
      ) + "원"
    );
  }

  function getProductIcon(category) {
    const matchedCategory =
      categoryOptions.find((option) => {
        return option.value === category;
      });

    return matchedCategory?.icon || CircuitBoard;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-6 px-6 py-3">
          <Link
            to="/home"
            className="flex items-center gap-2 text-2xl font-bold text-cyan-400"
          >
            <Cpu size={27} />
            UpgradeHub
          </Link>

          <nav className="flex flex-wrap items-center justify-end gap-5 text-sm">
            <Link
              to="/products"
              className="font-bold text-cyan-400"
            >
              PRODUCTS
            </Link>

            <Link
              to="/mypc"
              className="transition hover:text-cyan-400"
            >
              MY PC
            </Link>

            <Link
              to="/orders"
              className="transition hover:text-cyan-400"
            >
              ORDERS
            </Link>

            <Link
              to="/advisor"
              className="transition hover:text-cyan-400"
            >
              AI ADVISOR
            </Link>

            <button
              type="button"
              onClick={handleCart}
              className="flex items-center gap-2 transition hover:text-cyan-400"
            >
              <ShoppingCart size={18} />
              CART
            </button>

            {isLoggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="transition hover:text-red-400"
              >
                LOGOUT
              </button>
            ) : (
              <Link
                to="/login"
                className="transition hover:text-cyan-400"
              >
                LOGIN
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="mb-8 overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 to-cyan-950 p-8">
          <p className="mb-2 text-sm font-bold tracking-widest text-cyan-400">
            PC COMPONENT STORE
          </p>

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-4xl font-white md:text-5xl">
                PC 부품 상품
              </h1>

              <p className="mt-3 max-w-2xl leading-7 text-slate-300">
                CPU, GPU, RAM, SSD 등 다양한
                PC 부품을 검색하고 MY PC와
                비교해 보세요.
              </p>
            </div>

            <button
              type="button"
              onClick={refreshProducts}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-5 py-3 font-bold text-slate-300 transition hover:border-cyan-500 hover:text-cyan-400 disabled:opacity-50"
            >
              <RefreshCw
                size={18}
                className={
                  loading ? "animate-spin" : ""
                }
              />

              새로고침
            </button>
          </div>
        </section>

        <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-3 md:flex-row"
          >
            <div className="relative flex-1">
              <Search
                size={20}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="search"
                value={keyword}
                placeholder="상품명을 검색하세요. 예: RTX, Ryzen"
                onChange={(event) => {
                  setKeyword(event.target.value);
                }}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3.5 pl-12 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-7 py-3.5 font-black text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
            >
              <Search size={19} />
              검색
            </button>

            <button
              type="button"
              onClick={resetSearch}
              className="rounded-xl border border-slate-700 px-6 py-3.5 font-bold text-slate-300 transition hover:border-red-500/50 hover:text-red-400"
            >
              초기화
            </button>
          </form>

          {(keywordFromUrl ||
            categoryFromUrl !== "ALL") && (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-slate-500">
                적용된 조건:
              </span>

              {keywordFromUrl && (
                <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-cyan-300">
                  검색어: {keywordFromUrl}
                </span>
              )}

              {categoryFromUrl !== "ALL" && (
                <span className="rounded-full bg-violet-500/10 px-3 py-1 text-violet-300">
                  카테고리: {categoryFromUrl}
                </span>
              )}
            </div>
          )}
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-xl font-bold">
            카테고리
          </h2>

          <div className="flex flex-wrap gap-3">
            {categoryOptions.map((option) => {
              const Icon = option.icon;

              const isActive =
                selectedCategory === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    handleCategoryChange(
                      option.value
                    );
                  }}
                  className={
                    "flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition " +
                    (isActive
                      ? "border-cyan-500 bg-cyan-500 text-slate-950"
                      : "border-slate-700 bg-slate-900 text-slate-300 hover:border-cyan-500/60 hover:text-cyan-400")
                  }
                >
                  <Icon size={18} />
                  {option.label}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold">
                PRODUCTS
              </h2>

              {!loading && !message && (
                <p className="mt-2 text-slate-400">
                  검색 결과 {products.length}개
                </p>
              )}
            </div>
          </div>

          {loading && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 py-20 text-center">
              <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

              <p className="text-slate-400">
                상품 목록을 불러오는 중입니다.
              </p>
            </div>
          )}

          {!loading && message && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-10 text-center">
              <p className="text-red-300">
                {message}
              </p>

              <button
                type="button"
                onClick={refreshProducts}
                className="mt-5 rounded-lg bg-red-500 px-5 py-3 font-bold text-white transition hover:bg-red-400"
              >
                다시 시도
              </button>
            </div>
          )}

          {!loading &&
            !message &&
            products.length === 0 && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 py-20 text-center">
                <Search
                  size={50}
                  className="mx-auto text-slate-600"
                />

                <h3 className="mt-5 text-xl font-bold">
                  검색 결과가 없습니다.
                </h3>

                <p className="mt-2 text-slate-400">
                  다른 검색어나 카테고리를
                  선택해 보세요.
                </p>

                <button
                  type="button"
                  onClick={resetSearch}
                  className="mt-6 rounded-lg bg-cyan-500 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-400"
                >
                  전체 상품 보기
                </button>
              </div>
            )}

          {!loading &&
            !message &&
            products.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => {
                  const ProductIcon =
                    getProductIcon(
                      product.category
                    );

                  return (
  <article
    key={product.id}
    className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition hover:-translate-y-1 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-950/20"
  >
    <div className="relative flex h-52 items-center justify-center overflow-hidden bg-slate-800">
      {product.imageUrl ? (
    <img
      src={product.imageUrl}
      alt={product.name}
      onError={handleProductImageError}
      className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-105"
    />
  ) : (
    <ProductIcon
      size={76}
      className="text-cyan-400 transition duration-300 group-hover:scale-110"
    />
  )}

      <span className="absolute left-4 top-4 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-bold text-cyan-300">
        {product.category}
      </span>

      {product.stock === 0 && (
        <span className="absolute right-4 top-4 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
          품절
        </span>
      )}
    </div>

    <div className="p-5">


                      <div className="p-5">
                        <p className="text-sm font-semibold text-slate-500">
                          {product.brand}
                        </p>

                        <h3 className="mt-2 min-h-14 text-xl font-bold">
                          {product.name}
                        </h3>

                        <div className="mt-5 space-y-3 border-t border-slate-800 pt-4 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-500">
                              성능 점수
                            </span>

                            <span className="font-bold text-cyan-400">
                              {product.performanceScore !== null &&
                              product.performanceScore !== undefined
                                ? product.performanceScore + " / 100"
                                : "정보 없음"}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-slate-500">
                              재고
                            </span>

                            <span
                              className={
                                product.stock > 0
                                  ? "font-semibold text-green-400"
                                  : "font-semibold text-red-400"
                              }
                            >
                              {product.stock}개
                            </span>
                          </div>
                        </div>

                        <p className="mt-5 text-2xl font-black text-white">
                          {formatPrice(
                            product.price
                          )}
                        </p>

                        <button
                          type="button"
                          disabled={
                            product.stock === 0
                          }
                          onClick={() => {
                          navigate(
                            "/products/" + product.id,
                            {
                              state: {
                                from:
                                  "/products" +
                                  window.location.search,
                              },
                            }
                          );
                        }}
                          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 font-black text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
                        >
                          {product.stock === 0 ? (
                            "품절"
                          ) : (
                            <>
                              상품 상세 보기
                              <ShoppingCart
                                size={18}
                              />
                            </>
                          )}
                        </button>
                      </div></div>
                    </article>
                  );
          })}
              </div>
            )}
        </section>
      </main>
    </div>
  );
}

export default ProductsPage;