import {
  ArrowLeft,
  CircuitBoard,
  Cpu,
  HardDrive,
  MemoryStick,
  Monitor,
  PackagePlus,
  ShoppingCart,
  Zap,
} from "lucide-react";

import { useEffect, useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import api from "../api/axios.js";

const partDefinitions = [
  {
    key: "cpu",
    label: "CPU",
    description: "프로세서",
    icon: Cpu,
    color: "text-cyan-400",
    borderColor: "hover:border-cyan-500/60",
  },
  {
    key: "gpu",
    label: "GPU",
    description: "그래픽카드",
    icon: Monitor,
    color: "text-blue-400",
    borderColor: "hover:border-blue-500/60",
  },
  {
    key: "ram",
    label: "RAM",
    description: "메모리",
    icon: MemoryStick,
    color: "text-violet-400",
    borderColor: "hover:border-violet-500/60",
  },
  {
    key: "ssd",
    label: "SSD",
    description: "스토리지",
    icon: HardDrive,
    color: "text-emerald-400",
    borderColor: "hover:border-emerald-500/60",
  },
  {
    key: "motherboard",
    label: "MOTHERBOARD",
    description: "메인보드",
    icon: CircuitBoard,
    color: "text-amber-400",
    borderColor: "hover:border-amber-500/60",
  },
  {
    key: "power",
    label: "POWER",
    description: "파워서플라이",
    icon: Zap,
    color: "text-yellow-400",
    borderColor: "hover:border-yellow-500/60",
  },
];

export default function MyPcPage() {
  const navigate = useNavigate();

  const [myPc, setMyPc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  useEffect(() => {
    let active = true;

    async function loadMyPc() {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await api.get("/mypc/me");

        if (active) {
          setMyPc(response.data);
        }
      } catch (error) {
        if (!active) {
          return;
        }

        if (error.response?.status === 401) {
          localStorage.removeItem("token");

          navigate("/login", {
            state: {
              from: "/mypc",
            },
            replace: true,
          });

          return;
        }

        setErrorMessage(
          error.response?.data?.message ||
            "MY PC 정보를 불러오지 못했습니다."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadMyPc();

    return () => {
      active = false;
    };
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/home");
  }

  function formatPrice(price) {
    if (
      price === null ||
      price === undefined
    ) {
      return "가격 정보 없음";
    }

    return (
      Number(price).toLocaleString("ko-KR") +
      "원"
    );
  }

  function getInstalledPartCount() {
    if (!myPc) {
      return 0;
    }

    return partDefinitions.filter((definition) => {
      return Boolean(myPc[definition.key]);
    }).length;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
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
              className="font-bold text-cyan-400"
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
  to="/addresses"
  className="transition hover:text-cyan-400"
>
  ADDRESSES
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

        <section className="mb-8 overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 to-cyan-950 p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="mb-2 text-sm font-bold tracking-widest text-cyan-400">
                CURRENT PC CONFIGURATION
              </p>

              <h1 className="text-4xl font-white">
                MY PC
              </h1>

              <p className="mt-3 max-w-2xl leading-7 text-slate-300">
                현재 장착된 부품을 확인하고,
                새로운 부품과 성능 및 호환성을
                비교해 보세요.
              </p>
            </div>

            {!loading && myPc && (
              <div className="rounded-xl border border-cyan-500/30 bg-slate-950/60 px-6 py-4">
                <p className="text-sm text-slate-400">
                  등록된 부품
                </p>

                <p className="mt-1 text-3xl font-white text-cyan-400">
                  {getInstalledPartCount()}
                  <span className="ml-1 text-base text-slate-400">
                    / {partDefinitions.length}
                  </span>
                </p>
              </div>
            )}
          </div>
        </section>

        {loading && (
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-16 text-center">
            <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

            <p className="text-slate-400">
              MY PC 정보를 불러오는 중입니다.
            </p>
          </section>
        )}

        {!loading && errorMessage && (
          <section className="rounded-2xl border border-red-500/30 bg-red-500/10 p-10 text-center">
            <h2 className="text-xl font-bold text-red-300">
              MY PC 정보를 확인할 수 없습니다.
            </h2>

            <p className="mt-3 text-red-200">
              {errorMessage}
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/mypc/purchased-parts"
                className="rounded-lg bg-cyan-500 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-400"
              >
                구매한 부품 등록
              </Link>

              <Link
                to="/products"
                className="rounded-lg border border-slate-700 px-5 py-3 font-bold transition hover:border-cyan-500 hover:text-cyan-400"
              >
                상품 둘러보기
              </Link>
            </div>
          </section>
        )}

        {!loading && !errorMessage && myPc && (
          <>
            <section className="mb-8">
              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <h2 className="text-3xl font-bold">
                    INSTALLED PARTS
                  </h2>

                  <p className="mt-2 text-slate-400">
                    MY PC에 등록된 부품 목록입니다.
                  </p>
                </div>

                <Link
                  to="/mypc/purchased-parts"
                  className="flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-400"
                >
                  <PackagePlus size={19} />
                  구매 부품 장착
                </Link>
              </div>

              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {partDefinitions.map((definition) => {
                  const part =
                    myPc[definition.key];

                  const Icon = definition.icon;

                  return (
                    <article
                      key={definition.key}
                      className={
                        "rounded-2xl border border-slate-800 bg-slate-900 p-6 transition " +
                        definition.borderColor
                      }
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div
                          className={
                            "flex h-14 w-14 items-center justify-center rounded-xl bg-slate-800 " +
                            definition.color
                          }
                        >
                          <Icon size={30} />
                        </div>

                        <span className="rounded-full border border-slate-700 px-3 py-1 text-xs font-bold text-slate-400">
                          {definition.label}
                        </span>
                      </div>

                      <p className="mt-6 text-sm text-slate-500">
                        {definition.description}
                      </p>

                      {part ? (
                        <>
                          <h3 className="mt-1 min-h-14 text-xl font-bold">
                            {part.name}
                          </h3>

                          <div className="mt-5 space-y-3 border-t border-slate-800 pt-4 text-sm">
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-500">
                                제조사
                              </span>

                              <span className="font-semibold text-slate-300">
                                {part.brand ||
                                  "정보 없음"}
                              </span>
                            </div>

                            <div className="flex justify-between gap-4">
                              <span className="text-slate-500">
                                성능 점수
                              </span>

                              <span className="font-semibold text-cyan-400">
                                {part.performanceScore ??
                                  "정보 없음"}
                              </span>
                            </div>

                            <div className="flex justify-between gap-4">
                              <span className="text-slate-500">
                                상품 가격
                              </span>

                              <span className="font-semibold text-slate-300">
                                {formatPrice(part.price)}
                              </span>
                            </div>
                          </div>

                          <Link
                            to={
                              "/products/" +
                              part.id
                            }
                            className="mt-6 block rounded-lg border border-slate-700 py-2.5 text-center text-sm font-bold transition hover:border-cyan-500 hover:text-cyan-400"
                          >
                            상품 상세 보기
                          </Link>
                        </>
                      ) : (
                        <>
                          <h3 className="mt-1 text-xl font-bold text-slate-500">
                            등록된 부품 없음
                          </h3>

                          <p className="mt-4 min-h-12 text-sm leading-6 text-slate-500">
                            구매한 부품을 MY PC에
                            등록하면 이곳에 표시됩니다.
                          </p>

                          <Link
                            to="/mypc/purchased-parts"
                            className="mt-6 block rounded-lg border border-dashed border-slate-700 py-2.5 text-center text-sm font-bold text-slate-400 transition hover:border-cyan-500 hover:text-cyan-400"
                          >
                            부품 등록하기
                          </Link>
                        </>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 to-cyan-950/50 p-7">
                <p className="text-xs font-bold tracking-widest text-cyan-400">
                  PERFORMANCE
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  새로운 부품과 비교
                </h2>

                <p className="mt-3 leading-7 text-slate-400">
                  현재 장착된 부품과 판매 중인
                  상품의 성능 차이를 확인하세요.
                </p>

                <Link
                  to="/products"
                  className="mt-6 inline-block rounded-lg bg-cyan-500 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-400"
                >
                  비교할 상품 선택
                </Link>
              </div>

              <div className="rounded-2xl border border-green-500/30 bg-gradient-to-r from-slate-900 to-green-950/40 p-7">
                <p className="text-xs font-bold tracking-widest text-green-400">
                  AI ADVISOR
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  업그레이드 추천
                </h2>

                <p className="mt-3 leading-7 text-slate-400">
                  예산, 사용 목적, 성능 향상률과
                  호환성을 기준으로 구매 판단을
                  확인하세요.
                </p>

                <Link
                  to="/advisor"
                  className="mt-6 inline-block rounded-lg bg-green-500 px-5 py-3 font-bold text-slate-950 transition hover:bg-green-400"
                >
                  AI 추천 받기
                </Link>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}