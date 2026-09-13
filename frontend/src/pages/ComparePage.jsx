import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Cpu,
  Gauge,
  ShieldCheck,
  ShoppingCart,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../api/axios.js";

function ComparePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [product, setProduct] = useState(
    location.state?.product || null
  );

  const [comparison, setComparison] =
    useState(null);

  const [compatibility, setCompatibility] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const productDetailPath =
    location.state?.backTo ||
    "/products/" + id;

  const productsReturnPath =
    location.state?.productsReturnPath ||
    "/products";

  useEffect(() => {
    let active = true;

    async function loadComparison() {
      setLoading(true);
      setErrorMessage("");

      try {
        let targetProduct = product;

        if (!targetProduct) {
          const productResponse =
            await api.get(
              "/products/" + id
            );

          targetProduct =
            productResponse.data;

          if (active) {
            setProduct(targetProduct);
          }
        }

        const compatibilityRequest =
          api.get(
            "/compatibility/check",
            {
              params: {
                targetProductId: id,
              },
            }
          );

        let comparisonRequest = null;

        if (
          targetProduct.category === "GPU"
        ) {
          comparisonRequest =
            api.get("/compare/me", {
              params: {
                targetId: id,
              },
            });
        }

        const compatibilityResponse =
          await compatibilityRequest;

        if (active) {
          setCompatibility(
            compatibilityResponse.data
          );
        }

        if (comparisonRequest) {
          const comparisonResponse =
            await comparisonRequest;

          if (active) {
            setComparison(
              comparisonResponse.data
            );
          }
        }
      } catch (error) {
        if (!active) {
          return;
        }

        if (error.response?.status === 401) {
          localStorage.removeItem("token");

          navigate("/login", {
            state: {
              from: "/compare/" + id,
            },
            replace: true,
          });

          return;
        }

        setErrorMessage(
          error.response?.data?.message ||
            "비교 결과를 불러오지 못했습니다."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadComparison();

    return () => {
      active = false;
    };
  }, [id, navigate, product]);

  function formatPrice(price) {
    return (
      Number(price || 0).toLocaleString(
        "ko-KR"
      ) + "원"
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

          <p className="text-slate-400">
            성능과 호환성을 분석하는 중입니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-6 py-3">
          <Link
            to="/home"
            className="flex items-center gap-2 text-2xl font-bold text-cyan-400"
          >
            <Cpu size={27} />
            UpgradeHub
          </Link>

          <nav className="flex items-center gap-6 text-sm">
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
              to="/cart"
              className="flex items-center gap-2 transition hover:text-cyan-400"
            >
              <ShoppingCart size={18} />
              CART
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <button
          type="button"
          onClick={() => {
            navigate(productDetailPath, {
              state: {
                from: productsReturnPath,
              },
            });
          }}
          className="mb-7 flex items-center gap-2 text-sm text-slate-400 transition hover:text-cyan-400"
        >
          <ArrowLeft size={17} />
          상품 상세로 돌아가기
        </button>

        <section className="mb-8 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 to-cyan-950 p-8">
          <p className="text-sm font-bold tracking-widest text-cyan-400">
            PC UPGRADE ANALYSIS
          </p>

          <h1 className="mt-2 text-4xl font-black">
            호환성 및 성능 비교
          </h1>

          <p className="mt-3 text-slate-300">
            현재 MY PC와{" "}
            <strong className="text-white">
              {product?.name ||
                "선택한 상품"}
            </strong>
            을 비교한 결과입니다.
          </p>
        </section>

        {errorMessage ? (
          <section className="rounded-2xl border border-red-500/30 bg-red-500/10 p-10 text-center">
            <AlertTriangle
              size={48}
              className="mx-auto text-red-400"
            />

            <h2 className="mt-5 text-2xl font-bold text-red-300">
              비교할 수 없습니다.
            </h2>

            <p className="mt-3 text-red-200">
              {errorMessage}
            </p>

            <div className="mt-7 flex justify-center gap-3">
              <Link
                to="/mypc"
                className="rounded-lg bg-cyan-500 px-5 py-3 font-bold text-slate-950"
              >
                MY PC 확인
              </Link>

              <button
                type="button"
                onClick={() => {
                  navigate(
                    productsReturnPath
                  );
                }}
                className="rounded-lg border border-slate-700 px-5 py-3 font-bold"
              >
                상품 목록
              </button>
            </div>
          </section>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-7">
              <div className="flex items-center gap-3">
                <Gauge
                  size={28}
                  className="text-cyan-400"
                />

                <h2 className="text-2xl font-black">
                  성능 비교
                </h2>
              </div>

              {comparison ? (
                <div className="mt-7 space-y-4">
                  <div className="rounded-xl bg-slate-950 p-5">
                    <p className="text-sm text-slate-500">
                      현재 부품
                    </p>

                    <p className="mt-2 text-xl font-bold">
                      {comparison.current}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-950 p-5">
                    <p className="text-sm text-slate-500">
                      비교 상품
                    </p>

                    <p className="mt-2 text-xl font-bold text-cyan-400">
                      {comparison.target}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-5">
                      <p className="text-sm text-slate-400">
                        성능 향상률
                      </p>

                      <p className="mt-2 text-3xl font-black text-cyan-400">
                        {
                          comparison.performanceGainPercent
                        }
                        %
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-700 bg-slate-950 p-5">
                      <p className="text-sm text-slate-400">
                        가격 차이
                      </p>

                      <p className="mt-2 text-xl font-black">
                        {formatPrice(
                          comparison.priceDiff
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-5">
                    <p className="font-bold text-green-400">
                      추천 결과
                    </p>

                    <p className="mt-2 leading-7 text-slate-300">
                      {
                        comparison.recommendation
                      }
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-7 rounded-xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center">
                  <p className="text-slate-400">
                    현재 성능 비교는 GPU 상품을
                    대상으로 제공됩니다.
                  </p>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-7">
              <div className="flex items-center gap-3">
                <ShieldCheck
                  size={28}
                  className="text-green-400"
                />

                <h2 className="text-2xl font-black">
                  호환성 검사
                </h2>
              </div>

              {compatibility && (
                <div className="mt-7">
                  <div
                    className={
                      "rounded-xl border p-5 " +
                      (compatibility.compatible
                        ? "border-green-500/30 bg-green-500/10"
                        : "border-red-500/30 bg-red-500/10")
                    }
                  >
                    <div className="flex items-center gap-3">
                      {compatibility.compatible ? (
                        <CheckCircle2
                          size={28}
                          className="text-green-400"
                        />
                      ) : (
                        <AlertTriangle
                          size={28}
                          className="text-red-400"
                        />
                      )}

                      <div>
                        <p className="text-sm text-slate-400">
                          최종 결과
                        </p>

                        <p
                          className={
                            "mt-1 text-xl font-black " +
                            (compatibility.compatible
                              ? "text-green-400"
                              : "text-red-400")
                          }
                        >
                          {compatibility.compatible
                            ? "호환 가능"
                            : "확인 필요"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {compatibility.checks
                    ?.length > 0 && (
                    <div className="mt-5">
                      <h3 className="font-bold text-green-400">
                        통과 항목
                      </h3>

                      <div className="mt-3 space-y-2">
                        {compatibility.checks.map(
                          (check, index) => (
                            <div
                              key={index}
                              className="flex gap-3 rounded-xl bg-slate-950 p-4 text-sm text-slate-300"
                            >
                              <CheckCircle2
                                size={18}
                                className="shrink-0 text-green-400"
                              />

                              {check}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {compatibility.warnings
                    ?.length > 0 && (
                    <div className="mt-5">
                      <h3 className="font-bold text-red-400">
                        경고 항목
                      </h3>

                      <div className="mt-3 space-y-2">
                        {compatibility.warnings.map(
                          (
                            warning,
                            index
                          ) => (
                            <div
                              key={index}
                              className="flex gap-3 rounded-xl bg-red-500/10 p-4 text-sm text-red-200"
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
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              navigate(productsReturnPath);
            }}
            className="rounded-xl border border-slate-700 px-6 py-3 font-bold text-slate-300 transition hover:border-cyan-500 hover:text-cyan-400"
          >
            기존 검색 결과로 돌아가기
          </button>

          <button
            type="button"
            onClick={() => {
              navigate("/cart");
            }}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-black text-slate-950 transition hover:bg-cyan-400"
          >
            <ShoppingCart size={19} />
            장바구니 확인
          </button>
        </div>
      </main>
    </div>
  );
}

export default ComparePage;