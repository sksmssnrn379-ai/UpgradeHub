import {
  AlertTriangle,
  ArrowLeft,
  Bot,
  CheckCircle2,
  Cpu,
  Gauge,
  ShoppingCart,
  Wallet,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import api from "../api/axios.js";

function AdvisorPage() {
  const navigate = useNavigate();

  const [products, setProducts] =
    useState([]);

  const [targetProductId, setTargetProductId] =
    useState("");

  const [purpose, setPurpose] =
    useState("");

  const [budget, setBudget] =
    useState("");

  const [result, setResult] =
    useState(null);

  const [loadingProducts, setLoadingProducts] =
    useState(true);

  const [analyzing, setAnalyzing] =
    useState(false);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    let active = true;

    async function loadGpuProducts() {
      setLoadingProducts(true);
      setMessage("");

      try {
        const response = await api.get(
          "/products",
          {
            params: {
              category: "GPU",
            },
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
            "GPU 상품을 불러오지 못했습니다."
        );
      } finally {
        if (active) {
          setLoadingProducts(false);
        }
      }
    }

    loadGpuProducts();

    return () => {
      active = false;
    };
  }, []);

  async function handleRecommend(event) {
    event.preventDefault();

    if (!targetProductId) {
      setMessage(
        "비교할 GPU 상품을 선택해 주세요."
      );
      return;
    }

    if (!purpose.trim()) {
      setMessage(
        "PC 사용 목적을 입력해 주세요."
      );
      return;
    }

    const numericBudget = Number(budget);

    if (
      !Number.isFinite(numericBudget) ||
      numericBudget < 0
    ) {
      setMessage(
        "올바른 예산을 입력해 주세요."
      );
      return;
    }

    setAnalyzing(true);
    setMessage("");
    setResult(null);

    try {
      const response = await api.post(
        "/ai/recommend",
        {
          targetProductId:
            Number(targetProductId),

          purpose: purpose.trim(),

          budget: numericBudget,
        }
      );

      setResult(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");

        navigate("/login", {
          state: {
            from: "/advisor",
          },
          replace: true,
        });

        return;
      }

      setMessage(
        error.response?.data?.message ||
          "구매 판단 결과를 생성하지 못했습니다."
      );
    } finally {
      setAnalyzing(false);
    }
  }

  function formatPrice(price) {
    return (
      Number(price || 0).toLocaleString(
        "ko-KR"
      ) + "원"
    );
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/home");
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

          <nav className="flex flex-wrap items-center gap-5 text-sm">
            <Link
              to="/products"
              className="transition hover:text-cyan-400"
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
              className="font-bold text-green-400"
            >
              AI ADVISOR
            </Link>

            <Link
              to="/cart"
              className="flex items-center gap-2 transition hover:text-cyan-400"
            >
              <ShoppingCart size={18} />
              CART
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="transition hover:text-red-400"
            >
              LOGOUT
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <button
          type="button"
          onClick={() => {
            navigate("/home");
          }}
          className="mb-7 flex items-center gap-2 text-sm text-slate-400 transition hover:text-cyan-400"
        >
          <ArrowLeft size={17} />
          홈으로 돌아가기
        </button>

        <section className="mb-8 overflow-hidden rounded-2xl border border-green-500/30 bg-gradient-to-r from-slate-900 to-green-950/50 p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="mb-2 text-sm font-bold tracking-widest text-green-400">
                PERSONALIZED RECOMMENDATION
              </p>

              <h1 className="text-4xl font-black md:text-5xl">
                AI Advisor
              </h1>

              <p className="mt-3 max-w-2xl leading-7 text-slate-300">
                MY PC의 현재 GPU와 구매 예정
                GPU를 비교하고, 예산과 사용 목적,
                호환성을 함께 분석합니다.
              </p>
            </div>

            <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-green-500/30 bg-green-500/10">
              <Bot
                size={52}
                className="text-green-400"
              />
            </div>
          </div>
        </section>

        <div className="grid items-start gap-6 lg:grid-cols-[420px_1fr]">
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-7">
            <h2 className="text-2xl font-black">
              구매 조건 입력
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              구매를 고려하는 GPU와 사용 목적,
              최대 예산을 입력해 주세요.
            </p>

            <form
              onSubmit={handleRecommend}
              className="mt-7 space-y-5"
            >
              <div>
                <label
                  htmlFor="targetProduct"
                  className="mb-2 block text-sm font-bold text-slate-300"
                >
                  비교할 GPU
                </label>

                <select
                  id="targetProduct"
                  value={targetProductId}
                  disabled={loadingProducts}
                  onChange={(event) => {
                    setTargetProductId(
                      event.target.value
                    );
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-50"
                >
                  <option value="">
                    {loadingProducts
                      ? "상품을 불러오는 중..."
                      : "GPU 상품을 선택하세요"}
                  </option>

                  {products.map((product) => (
                    <option
                      key={product.id}
                      value={product.id}
                    >
                      {product.name} /{" "}
                      {formatPrice(product.price)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="purpose"
                  className="mb-2 block text-sm font-bold text-slate-300"
                >
                  PC 사용 목적
                </label>

                <textarea
                  id="purpose"
                  value={purpose}
                  rows={4}
                  placeholder="예: QHD 게임과 영상 편집"
                  onChange={(event) => {
                    setPurpose(
                      event.target.value
                    );
                  }}
                  className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>

              <div>
                <label
                  htmlFor="budget"
                  className="mb-2 block text-sm font-bold text-slate-300"
                >
                  최대 예산
                </label>

                <div className="relative">
                  <Wallet
                    size={19}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    id="budget"
                    type="number"
                    min="0"
                    step="1000"
                    value={budget}
                    placeholder="예: 1500000"
                    onChange={(event) => {
                      setBudget(
                        event.target.value
                      );
                    }}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3.5 pl-12 pr-12 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                    원
                  </span>
                </div>
              </div>

              {message && (
                <div className="flex gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  <AlertTriangle
                    size={18}
                    className="shrink-0"
                  />

                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={
                  analyzing ||
                  loadingProducts
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 py-3.5 font-black text-slate-950 transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Bot size={20} />

                {analyzing
                  ? "구매 조건 분석 중..."
                  : "구매 판단 받기"}
              </button>
            </form>
          </section>

          <section className="min-h-[520px] rounded-2xl border border-slate-800 bg-slate-900 p-7">
            {!result && !analyzing && (
              <div className="flex min-h-[460px] flex-col items-center justify-center text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-slate-800">
                  <Bot
                    size={52}
                    className="text-slate-600"
                  />
                </div>

                <h2 className="mt-6 text-2xl font-black">
                  분석 조건을 입력해 주세요.
                </h2>

                <p className="mt-3 max-w-md leading-7 text-slate-400">
                  GPU, 사용 목적과 예산을 입력하면
                  성능 향상률, 예산 적합성,
                  호환성을 종합해 구매 판단을
                  제공합니다.
                </p>
              </div>
            )}

            {analyzing && (
              <div className="flex min-h-[460px] flex-col items-center justify-center">
                <div className="h-14 w-14 animate-spin rounded-full border-4 border-slate-700 border-t-green-400" />

                <h2 className="mt-6 text-xl font-bold">
                  구매 조건을 분석하고 있습니다.
                </h2>

                <p className="mt-2 text-slate-400">
                  잠시만 기다려 주세요.
                </p>
              </div>
            )}

            {result && !analyzing && (
              <div>
                <div className="flex items-center gap-3">
                  <CheckCircle2
                    size={30}
                    className={
                      result.compatible
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  />

                  <div>
                    <p className="text-sm font-bold tracking-widest text-green-400">
                      ANALYSIS RESULT
                    </p>

                    <h2 className="mt-1 text-3xl font-black">
                      구매 판단 결과
                    </h2>
                  </div>
                </div>

                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                    <p className="text-sm text-slate-500">
                      현재 GPU
                    </p>

                    <p className="mt-2 text-lg font-bold">
                      {result.currentProductName}
                    </p>
                  </div>

                  <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-5">
                    <p className="text-sm text-slate-400">
                      비교 GPU
                    </p>

                    <p className="mt-2 text-lg font-bold text-cyan-400">
                      {result.targetProductName}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                    <Gauge
                      size={22}
                      className="text-cyan-400"
                    />

                    <p className="mt-3 text-sm text-slate-500">
                      성능 향상률
                    </p>

                    <p className="mt-1 text-2xl font-black text-cyan-400">
                      {result.performanceGainPercent}
                      %
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                    <Wallet
                      size={22}
                      className="text-violet-400"
                    />

                    <p className="mt-3 text-sm text-slate-500">
                      대상 가격
                    </p>

                    <p className="mt-1 font-black">
                      {formatPrice(
                        result.targetPrice
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                    <CheckCircle2
                      size={22}
                      className={
                        result.withinBudget
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    />

                    <p className="mt-3 text-sm text-slate-500">
                      예산 여부
                    </p>

                    <p
                      className={
                        "mt-1 font-black " +
                        (result.withinBudget
                          ? "text-green-400"
                          : "text-red-400")
                      }
                    >
                      {result.withinBudget
                        ? "예산 범위"
                        : "예산 초과"}
                    </p>
                  </div>
                </div>

                <div
                  className={
                    "mt-5 rounded-xl border p-5 " +
                    (result.compatible
                      ? "border-green-500/30 bg-green-500/10"
                      : "border-red-500/30 bg-red-500/10")
                  }
                >
                  <p className="text-sm text-slate-400">
                    호환성
                  </p>

                  <p
                    className={
                      "mt-1 text-xl font-black " +
                      (result.compatible
                        ? "text-green-400"
                        : "text-red-400")
                    }
                  >
                    {result.compatible
                      ? "현재 PC와 호환 가능"
                      : "호환성 확인 필요"}
                  </p>
                </div>

                {result.compatibilityWarnings
                  ?.length > 0 && (
                  <div className="mt-5 space-y-2">
                    {result.compatibilityWarnings.map(
                      (warning, index) => (
                        <div
                          key={index}
                          className="flex gap-3 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-200"
                        >
                          <AlertTriangle
                            size={18}
                            className="shrink-0 text-red-400"
                          />

                          {warning}
                        </div>
                      )
                    )}
                  </div>
                )}

                <div className="mt-5 rounded-xl border border-cyan-500/30 bg-slate-950 p-6">
                  <p className="text-sm font-bold text-cyan-400">
                    최종 추천
                  </p>

                  <h3 className="mt-2 text-2xl font-black">
                    {result.recommendation}
                  </h3>

                  <p className="mt-4 leading-8 text-slate-300">
                    {result.reason}
                  </p>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigate(
                        "/products/" +
                          result.targetProductId
                      );
                    }}
                    className="rounded-xl border border-slate-700 py-3 font-bold transition hover:border-cyan-500 hover:text-cyan-400"
                  >
                    대상 상품 보기
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setResult(null);
                    }}
                    className="rounded-xl bg-green-500 py-3 font-black text-slate-950 transition hover:bg-green-400"
                  >
                    다시 분석하기
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default AdvisorPage;