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
      try {
        const response = await api.get(
          "/mypc/purchased-parts"
        );

        if (active) {
          setParts(response.data);
        }
      } catch (error) {
        if (
          error.response?.status === 401
        ) {
          navigate("/login", {
            state: {
              from:
                "/mypc/purchased-parts",
            },
            replace: true,
          });

          return;
        }

        if (active) {
          setMessage(
            error.response?.data?.message ||
              "구매한 부품을 불러오지 못했습니다."
          );

          setMessageType("error");
        }
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

  async function equipPart(productId) {
    setEquippingId(productId);
    setMessage("");

    try {
      await api.put("/mypc/parts", {
        productId: productId,
      });

      setMessage(
        "선택한 부품을 MY PC에 장착했습니다."
      );

      setMessageType("success");
    } catch (error) {
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
          className="mb-7 flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400"
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
            주문한 부품 중 MY PC에 장착할
            부품을 선택하세요.
          </p>
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

        {loading ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-16 text-center text-slate-400">
            구매한 부품을 불러오는 중입니다.
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

            <Link
              to="/products"
              className="mt-6 inline-block rounded-xl bg-cyan-500 px-6 py-3 font-bold text-slate-950"
            >
              상품 둘러보기
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {parts.map((part) => (
              <article
                key={part.purchasedPartId}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
              >
                <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-300">
                  {part.category}
                </span>

                <h2 className="mt-5 text-xl font-bold">
                  {part.name}
                </h2>

                <p className="mt-2 text-slate-400">
                  {part.brand}
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
                    equippingId ===
                    part.productId
                  }
                  onClick={() => {
                    equipPart(
                      part.productId
                    );
                  }}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 font-black text-slate-950 disabled:opacity-50"
                >
                  <CheckCircle2 size={18} />

                  {equippingId ===
                  part.productId
                    ? "장착 중..."
                    : "MY PC에 장착"}
                </button>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default PurchasedPartsPage;