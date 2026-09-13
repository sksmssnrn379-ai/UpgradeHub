import {
  ArrowLeft,
  CheckCircle2,
  CircuitBoard,
  Cpu,
  HardDrive,
  MemoryStick,
  Minus,
  Monitor,
  Plus,
  ShoppingCart,
  Zap,
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

const specDefinitions = [
  {
    key: "cpuSocket",
    label: "CPU 소켓",
  },
  {
    key: "memoryType",
    label: "메모리 규격",
  },
  {
    key: "powerConsumption",
    label: "소비전력",
    suffix: "W",
  },
  {
    key: "recommendedPower",
    label: "권장 파워",
    suffix: "W",
  },
  {
    key: "powerCapacity",
    label: "파워 용량",
    suffix: "W",
  },
  {
    key: "gpuInterface",
    label: "GPU 인터페이스",
  },
  {
    key: "storageInterface",
    label: "저장장치 인터페이스",
  },
];

function ProductDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();

  
  const { id } = useParams();
  const productsReturnPath =
  location.state?.from || "/products";

  const [product, setProduct] =
    useState(null);

  const [spec, setSpec] =
    useState(null);

  const [quantity, setQuantity] =
    useState(1);

  const [loading, setLoading] =
    useState(true);

  const [adding, setAdding] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState("");

  const [isLoggedIn, setIsLoggedIn] =
    useState(
      Boolean(localStorage.getItem("token"))
    );

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      setLoading(true);
      setMessage("");
      setMessageType("");

      try {
        const productResponse =
          await api.get(
            "/products/" + id
          );

        if (!active) {
          return;
        }

        setProduct(productResponse.data);

        try {
          const specResponse =
            await api.get(
              "/products/" +
                id +
                "/spec"
            );

          if (active) {
            setSpec(specResponse.data);
          }
        } catch {
          if (active) {
            setSpec(null);
          }
        }
      } catch (error) {
        if (!active) {
          return;
        }

        const errorMessage =
          error.response?.data?.message ||
          "상품 정보를 불러오지 못했습니다.";

        setProduct(null);
        setMessage(errorMessage);
        setMessageType("error");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      active = false;
    };
  }, [id]);

  function handleLogout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/home");
  }

  function decreaseQuantity() {
    setQuantity((currentQuantity) => {
      if (currentQuantity <= 1) {
        return 1;
      }

      return currentQuantity - 1;
    });
  }

  function increaseQuantity() {
    if (!product) {
      return;
    }

    setQuantity((currentQuantity) => {
      if (
        currentQuantity >= product.stock
      ) {
        return currentQuantity;
      }

      return currentQuantity + 1;
    });
  }

  function handleQuantityChange(event) {
    const nextQuantity =
      Number(event.target.value);

    if (!Number.isInteger(nextQuantity)) {
      return;
    }

    if (nextQuantity < 1) {
      setQuantity(1);
      return;
    }

    if (
      product &&
      nextQuantity > product.stock
    ) {
      setQuantity(product.stock);
      return;
    }

    setQuantity(nextQuantity);
  }

  async function addToCart() {
    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/login", {
        state: {
          from:
            "/products/" + product.id,
        },
      });

      return;
    }

    setAdding(true);
    setMessage("");
    setMessageType("");

    try {
      await api.post(
        "/cart/items",
        {
          productId: product.id,
          quantity: quantity,
        }
      );

      setMessage(
        "상품을 장바구니에 담았습니다."
      );

      setMessageType("success");
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        setIsLoggedIn(false);

        navigate("/login", {
          state: {
            from:
              "/products/" + product.id,
          },
          replace: true,
        });

        return;
      }

      const errorMessage =
        error.response?.data?.message ||
        "장바구니에 상품을 담지 못했습니다.";

      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setAdding(false);
    }
  }

  function moveToCart() {
    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/login", {
        state: {
          from: "/cart",
        },
      });

      return;
    }

    navigate("/cart");
  }

  function moveToComparison() {
  const comparisonPath =
    "/compare/" + product.id;

  const token =
    localStorage.getItem("token");

  if (!token) {
    navigate("/login", {
      state: {
        from: comparisonPath,
      },
    });

    return;
  }

  navigate(comparisonPath, {
    state: {
      product: product,
      backTo:
        "/products/" + product.id,
      productsReturnPath:
        productsReturnPath,
    },
  });
}


  function formatPrice(price) {
    return (
      Number(price || 0).toLocaleString(
        "ko-KR"
      ) + "원"
    );
  }

  function renderSpecValue(
    value,
    suffix
  ) {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "정보 없음";
    }

    return String(value) + (suffix || "");
  }

  const PRODUCT_ICONS = {
  CPU: Cpu,
  GPU: Monitor,
  RAM: MemoryStick,
  SSD: HardDrive,
  MOTHERBOARD: CircuitBoard,
  POWER: Zap,
};

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

          <p className="text-slate-400">
            상품 정보를 불러오는 중입니다.
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <section className="w-full max-w-lg rounded-2xl border border-red-500/30 bg-slate-900 p-10 text-center">
          <h1 className="text-2xl font-bold text-red-300">
            상품 정보를 확인할 수 없습니다.
          </h1>

          <p className="mt-4 text-slate-400">
            {message ||
              "상품을 찾을 수 없습니다."}
          </p>

          <button
            type="button"
            onClick={() => {
              navigate(productsReturnPath);
            }}
            className="mt-7 rounded-xl bg-cyan-500 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-400"
          >
            상품 목록으로 돌아가기
          </button>
        </section>
      </div>
    );
  }

  const totalPrice =
    Number(product.price) * quantity;

  const ProductIcon =
  PRODUCT_ICONS[product.category] ||
  CircuitBoard;

  const registeredSpecs =
    specDefinitions.filter(
      (definition) => {
        if (!spec) {
          return false;
        }

        const value =
          spec[definition.key];

        return (
          value !== null &&
          value !== undefined &&
          value !== ""
        );
      }
    );

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
              onClick={moveToCart}
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
        <button
          type="button"
          onClick={() => {
            navigate(productsReturnPath);
          }}
          className="mb-7 flex items-center gap-2 text-sm text-slate-400 transition hover:text-cyan-400"
        >
          <ArrowLeft size={17} />
          상품 목록으로 돌아가기
        </button>

        <section className="mb-8 overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 to-cyan-950 p-8">
          <p className="mb-2 text-sm font-bold tracking-widest text-cyan-400">
            PRODUCT DETAIL
          </p>

          <h1 className="text-4xl font-black md:text-5xl">
            {product.name}
          </h1>

          <p className="mt-3 text-slate-300">
            상품 정보와 상세 사양을 확인하고
            MY PC와 비교해 보세요.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <div className="relative flex min-h-80 items-center justify-center bg-slate-800">
              <ProductIcon
                size={130}
                className="text-cyan-400"
              />

              <span className="absolute left-6 top-6 rounded-full border border-cyan-500/30 bg-slate-950/80 px-4 py-2 text-sm font-bold text-cyan-300">
                {product.category}
              </span>

              {product.stock === 0 && (
                <span className="absolute right-6 top-6 rounded-full bg-red-500 px-4 py-2 text-sm font-bold">
                  품절
                </span>
              )}
            </div>

            <div className="p-7">
              <p className="text-sm font-bold tracking-wider text-cyan-400">
                {product.brand}
              </p>

              <h2 className="mt-2 text-3xl font-black">
                {product.name}
              </h2>

              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-sm text-slate-500">
                    판매 가격
                  </p>

                  <p className="mt-2 text-lg font-black text-cyan-400">
                    {formatPrice(
                      product.price
                    )}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-sm text-slate-500">
                    현재 재고
                  </p>

                  <p
                    className={
                      "mt-2 text-lg font-black " +
                      (product.stock > 0
                        ? "text-green-400"
                        : "text-red-400")
                    }
                  >
                    {product.stock}개
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-sm text-slate-500">
                    성능 점수
                  </p>

                  <p className="mt-2 text-lg font-black text-violet-400">
                    {product.performanceScore ??
                      "정보 없음"}
                  </p>
                </div>
              </div>

              <div className="mt-7 rounded-xl border border-slate-800 bg-slate-950 p-5">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                  <div>
                    <p className="font-bold">
                      구매 수량
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      재고 범위 안에서 수량을
                      선택할 수 있습니다.
                    </p>
                  </div>

                  <div className="flex items-center overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="p-3 text-slate-300 transition hover:bg-slate-800 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Minus size={19} />
                    </button>

                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={
                        handleQuantityChange
                      }
                      className="w-16 border-x border-slate-700 bg-slate-950 py-3 text-center font-black text-white outline-none"
                    />

                    <button
                      type="button"
                      onClick={increaseQuantity}
                      disabled={
                        quantity >= product.stock
                      }
                      className="p-3 text-slate-300 transition hover:bg-slate-800 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Plus size={19} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-end justify-between rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-5">
                <div>
                  <p className="text-sm text-slate-400">
                    총 상품 금액
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    수량 {quantity}개 기준
                  </p>
                </div>

                <strong className="text-3xl font-black text-cyan-400">
                  {formatPrice(totalPrice)}
                </strong>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={addToCart}
                  disabled={
                    adding ||
                    product.stock === 0
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3.5 font-black text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
                >
                  <ShoppingCart size={19} />

                  {product.stock === 0
                    ? "품절"
                    : adding
                      ? "장바구니에 담는 중..."
                      : "장바구니 담기"}
                </button>

                <button
                  type="button"
                  onClick={moveToComparison}
                  className="rounded-xl border border-slate-700 py-3.5 font-bold text-slate-200 transition hover:border-green-500 hover:bg-green-500/10 hover:text-green-400"
                >
                  MY PC와 비교
                </button>
              </div>

              {message && (
                <div
                  role="status"
                  className={
                    "mt-5 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm " +
                    (messageType === "success"
                      ? "border-green-500/30 bg-green-500/10 text-green-300"
                      : "border-red-500/30 bg-red-500/10 text-red-300")
                  }
                >
                  {messageType ===
                    "success" && (
                    <CheckCircle2
                      size={18}
                    />
                  )}

                  {message}
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-7">
            <div className="mb-6">
              <p className="text-sm font-bold tracking-widest text-cyan-400">
                TECHNICAL SPECIFICATION
              </p>

              <h2 className="mt-2 text-3xl font-black">
                상세 사양
              </h2>

              <p className="mt-3 text-slate-400">
                상품에 등록된 주요 하드웨어
                사양입니다.
              </p>
            </div>

            {!spec ||
            registeredSpecs.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950 p-10 text-center">
                <CircuitBoard
                  size={48}
                  className="mx-auto text-slate-600"
                />

                <h3 className="mt-4 font-bold">
                  등록된 상세 사양이 없습니다.
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  상품의 기본 정보는 왼쪽에서
                  확인할 수 있습니다.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {registeredSpecs.map(
                  (definition) => (
                    <div
                      key={definition.key}
                      className="flex items-center justify-between gap-5 rounded-xl border border-slate-800 bg-slate-950 px-5 py-4"
                    >
                      <span className="text-sm text-slate-500">
                        {definition.label}
                      </span>

                      <strong className="text-right text-slate-200">
                        {renderSpecValue(
                          spec[
                            definition.key
                          ],
                          definition.suffix
                        )}
                      </strong>
                    </div>
                  )
                )}
              </div>
            )}

            <div className="mt-7 rounded-xl border border-green-500/30 bg-green-500/10 p-5">
              <p className="text-sm font-bold text-green-400">
                호환성 확인 안내
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                MY PC와 비교하면 현재 구성에
                장착 가능한지와 업그레이드 효과를
                확인할 수 있습니다.
              </p>

              <button
                type="button"
                onClick={moveToComparison}
                className="mt-4 w-full rounded-lg bg-green-500 py-3 font-bold text-slate-950 transition hover:bg-green-400"
              >
                호환성 및 성능 비교
              </button>
            </div>

            <Link
              to="/products"
              className="mt-4 block rounded-xl border border-slate-700 py-3 text-center font-bold text-slate-300 transition hover:border-cyan-500 hover:text-cyan-400"
            >
              다른 상품 둘러보기
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}

export default ProductDetailPage;