import {
  ArrowLeft,
  CheckCircle2,
  Cpu,
  Package,
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

function PurchasedPartsPage() {
  const navigate = useNavigate();

  const [myPc, setMyPc] =
    useState(null);

  const [parts, setParts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [equippingId, setEquippingId] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState("");

  useEffect(() => {
    let active = true;

    async function loadPurchasedParts() {
      setLoading(true);
      setMessage("");
      setMessageType("");

      try {
        const [
          purchasedPartsResponse,
          myPcResponse,
        ] = await Promise.all([
          api.get(
            "/mypc/purchased-parts"
          ),
          api.get("/mypc/me"),
        ]);

        if (!active) {
          return;
        }

        setParts(
          Array.isArray(
            purchasedPartsResponse.data
          )
            ? purchasedPartsResponse.data
            : []
        );

        setMyPc(myPcResponse.data);
      } catch (error) {
        if (!active) {
          return;
        }

        if (
          error.response?.status === 401
        ) {
          localStorage.removeItem(
            "token"
          );

          navigate("/login", {
            state: {
              from:
                "/mypc/purchased-parts",
            },
            replace: true,
          });

          return;
        }

        setMessage(
          error.response?.data?.message ||
            "구매한 부품을 불러오지 못했습니다."
        );

        setMessageType("error");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadPurchasedParts();

    return () => {
      active = false;
    };
  }, [navigate]);

  function isInstalledPart(part) {
    if (!myPc || !part) {
      return false;
    }

    const slotByCategory = {
      CPU: "cpu",
      GPU: "gpu",
      RAM: "ram",
      SSD: "ssd",
      MOTHERBOARD: "motherboard",
      POWER: "power",
    };

    const normalizedCategory = String(
      part.category || ""
    )
      .trim()
      .toUpperCase();

    const slotKey =
      slotByCategory[
        normalizedCategory
      ];

    if (!slotKey) {
      return false;
    }

    const installedPart =
      myPc[slotKey];

    if (
      !installedPart ||
      installedPart.id === null ||
      installedPart.id === undefined
    ) {
      return false;
    }

    return (
      String(installedPart.id) ===
      String(part.productId)
    );
  }

  async function equipPart(
    purchasedPartId,
    productId
  ) {
    if (
      purchasedPartId === null ||
      purchasedPartId === undefined ||
      productId === null ||
      productId === undefined
    ) {
      setMessage(
        "장착할 부품 정보가 올바르지 않습니다."
      );

      setMessageType("error");
      return;
    }

    setEquippingId(purchasedPartId);
    setMessage("");
    setMessageType("");

    try {
      await api.put("/mypc/parts", {
        productId: productId,
      });

      const myPcResponse =
        await api.get("/mypc/me");

      setMyPc(myPcResponse.data);

      setMessage(
        "선택한 부품을 MY PC에 장착했습니다."
      );

      setMessageType("success");
    } catch (error) {
      if (
        error.response?.status === 401
      ) {
        localStorage.removeItem(
          "token"
        );

        navigate("/login", {
          state: {
            from:
              "/mypc/purchased-parts",
          },
          replace: true,
        });

        return;
      }

      setMessage(
        error.response?.data?.message ||
          "부품을 장착하지 못했습니다."
      );

      setMessageType("error");
    } finally {
      setEquippingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-6">
          <Link
            to="/home"
            className="flex items-center gap-2 text-2xl font-bold text-cyan-400"
          >
            <Cpu size={27} />
            UpgradeHub
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <button
          type="button"
          onClick={() => {
            navigate("/mypc");
          }}
          className="mb-7 flex items-center gap-2 text-sm text-slate-400 transition hover:text-cyan-400"
        >
          <ArrowLeft size={17} />
          MY PC로 돌아가기
        </button>

        <section className="mb-8 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 to-cyan-950 p-8">
          <p className="text-sm font-bold tracking-widest text-cyan-400">
            PURCHASED COMPONENTS
          </p>

          <h1 className="mt-2 text-4xl font-black">
            구매한 부품
          </h1>

          <p className="mt-3 text-slate-300">
            주문한 부품 중 MY PC에
            장착할 부품을 선택하세요.
          </p>
        </section>

        {message && (
          <div
            role="status"
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

        {loading ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-16 text-center text-slate-400">
            구매한 부품을 불러오는
            중입니다.
          </div>
        ) : parts.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-16 text-center">
            <Package
              size={50}
              className="mx-auto text-slate-600"
            />

            <h2 className="mt-5 text-xl font-bold">
              구매한 부품이 없습니다.
            </h2>

            <p className="mt-3 text-slate-400">
              상품을 주문하면 구매한 부품
              목록에 표시됩니다.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-block rounded-xl bg-cyan-500 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-400"
            >
              상품 둘러보기
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {parts.map((part) => {
              const cardId =
                part.purchasedPartId ??
                part.productId;

              const isCurrentEquipping =
                String(equippingId) ===
                String(cardId);

              const isAnyEquipping =
                equippingId !== null;

              const isInstalled =
                isInstalledPart(part);

              return (
                <article
                  key={cardId}
                  className={
                    "rounded-2xl border bg-slate-900 p-6 transition " +
                    (isInstalled
                      ? "border-green-500/50 shadow-lg shadow-green-500/5"
                      : "border-slate-800 hover:border-cyan-500/40")
                  }
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-300">
                      {part.category}
                    </span>

                    {isInstalled && (
                      <span className="flex items-center gap-1 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-bold text-green-400">
                        <CheckCircle2
                          size={14}
                        />
                        장착됨
                      </span>
                    )}
                  </div>

                  <h2 className="mt-5 min-h-14 text-xl font-bold">
                    {part.name}
                  </h2>

                  <p className="mt-2 text-slate-400">
                    {part.brand ||
                      "제조사 정보 없음"}
                  </p>

                  <div className="mt-5 flex justify-between border-t border-slate-800 pt-4 text-sm">
                    <span className="text-slate-500">
                      보유 수량
                    </span>

                    <strong>
                      {part.quantity}개
                    </strong>
                  </div>

                  <button
                    type="button"
                    disabled={
                      isAnyEquipping ||
                      isInstalled
                    }
                    onClick={() => {
                      equipPart(
                        cardId,
                        part.productId
                      );
                    }}
                    className={
                      "mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-black transition disabled:cursor-not-allowed " +
                      (isInstalled
                        ? "border border-green-500/40 bg-green-500/10 text-green-400 opacity-100"
                        : "bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-50")
                    }
                  >
                    <CheckCircle2
                      size={18}
                    />

                    {isCurrentEquipping
                      ? "장착 중..."
                      : isInstalled
                        ? "현재 장착됨"
                        : "MY PC에 장착"}
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default PurchasedPartsPage;