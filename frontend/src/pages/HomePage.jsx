import {
  CircuitBoard,
  Cpu,
  HardDrive,
  MemoryStick,
  Monitor,
  ShoppingCart,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";



import api from "../api/axios.js";

const categories = [
  {
    name: "그래픽카드",
    category: "GPU",
    icon: Monitor,
  },
  {
    name: "프로세서",
    category: "CPU",
    icon: Cpu,
  },
  {
    name: "메모리",
    category: "RAM",
    icon: MemoryStick,
  },
  {
    name: "스토리지",
    category: "SSD",
    icon: HardDrive,
  },
  {
    name: "메인보드",
    category: "MOTHERBOARD",
    icon: CircuitBoard,
  },
  {
    name: "파워서플라이",
    category: "POWER",
    icon: Zap,
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await api.get("/products");

        if (active) {
          setProducts(response.data);
        }
      } catch (error) {
        if (!active) {
          return;
        }

        setErrorMessage(
          error.response?.data?.message ||
            "상품 정보를 불러오지 못했습니다."
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
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/home");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link
            to="/home"
            className="text-2xl font-bold text-cyan-400"
          >
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

            <Link
              to="/cart"
              className="flex items-center gap-2 transition hover:text-cyan-400"
            >
              <ShoppingCart size={18} />
              CART
            </Link>

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

      <main>
        <section className="mx-auto max-w-7xl p-6">
          <div className="flex flex-col items-center justify-between gap-8 rounded-xl bg-gradient-to-r from-slate-900 to-cyan-950 p-10 md:flex-row">
            <div>
              <h1 className="mb-4 text-5xl font-bold text-white">
                AI-POWERED
                <br />
                PC UPGRADES
              </h1>

              <p className="text-lg text-slate-300">
                Smart comparison and personalized
                recommendations based on your MY PC.
              </p>
            </div>

            <div className="hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600"
                alt="Gaming PC"
                className="w-80 rounded-xl shadow-xl"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6">
          <h2 className="mb-6 text-3xl font-bold">
            SHOP BY CATEGORY
          </h2>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.category}
                  to={
                    "/products?category=" +
                    item.category
                  }
                  className="flex cursor-pointer flex-col items-center rounded-xl bg-slate-800 p-6 transition hover:bg-slate-700"
                >
                  <Icon
                    size={50}
                    className="text-cyan-400"
                  />

                  <h3 className="mt-4 font-semibold">
                    {item.name}
                  </h3>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl p-6">
          <div className="flex items-center justify-between rounded-xl border border-green-500 bg-slate-900 p-6">
            <div>
              <h2 className="text-3xl font-bold text-white text-green-400">
                AI Advisor
              </h2>

              <p className="mt-2 text-slate-300">
                현재 MY PC 구성과 구매 이력을
                분석하여 업그레이드를 추천합니다.
              </p>
            </div>

            <Link
              to="/advisor"
              className="rounded-lg bg-green-500 px-6 py-3 font-bold text-white transition hover:bg-green-400"
            >
              추천 받기
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-10">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-bold">
              FEATURED UPGRADES
            </h2>

            <Link
              to="/products"
              className="text-cyan-400 hover:text-cyan-300"
            >
              전체 보기
            </Link>
          </div>

          {loading && (
            <p className="text-slate-400">
              상품을 불러오는 중입니다.
            </p>
          )}

          {!loading && errorMessage && (
            <p className="rounded-lg bg-red-500/10 p-4 text-red-400">
              {errorMessage}
            </p>
          )}

          {!loading &&
            !errorMessage &&
            products.length === 0 && (
              <p className="text-slate-400">
                등록된 상품이 없습니다.
              </p>
            )}

          {!loading &&
            !errorMessage &&
            products.length > 0 && (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                {products
                  .slice(0, 8)
                  .map((product) => (
                    <article
                      key={product.id}
                      className="overflow-hidden rounded-xl bg-slate-800 transition hover:scale-105"
                    >
                      <div className="relative flex h-44 items-center justify-center overflow-hidden bg-slate-800">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <Monitor
                            size={80}
                            className="text-cyan-400"
                          />
                        )}

                        {product.category && (
                          <span className="absolute left-3 top-3 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-bold text-cyan-300">
                            {product.category}
                          </span>
                        )}
                      </div>

                      <div className="p-4">
                        <span className="rounded bg-green-600 px-2 py-1 text-sm">
                          {product.category}
                        </span>

                        <h3 className="mt-3 text-lg font-semibold">
                          {product.name}
                        </h3>

                        <p className="mt-1 text-sm text-slate-400">
                          {product.brand}
                        </p>

                        <p className="mt-2 font-bold text-cyan-400">
                          {Number(
                            product.price
                          ).toLocaleString("ko-KR")}
                          원
                        </p>

                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <Link
                            to={
                              "/products/" +
                              product.id
                            }
                            className="rounded-lg border border-slate-600 py-2 text-center transition hover:border-cyan-400 hover:text-cyan-400"
                          >
                            상세 보기
                          </Link>

                          <Link
                            to={
                              "/products/" +
                              product.id
                            }
                            className="flex items-center justify-center gap-2 rounded-lg bg-cyan-500 py-2 font-bold text-black transition hover:bg-cyan-400"
                          >
                            <ShoppingCart size={17} />
                            담기
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
              </div>
            )}
        </section>
      </main>
    </div>
  );
}
