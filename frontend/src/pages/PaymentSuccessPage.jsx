import {
  CheckCircle2,
  Cpu,
  Home,
  Package,
  XCircle,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import api from "../api/axios.js";

function PaymentSuccessPage() {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const paymentKey =
    searchParams.get(
      "paymentKey"
    );

  const orderId =
    searchParams.get(
      "orderId"
    );

  const amountParam =
    searchParams.get(
      "amount"
    );

  const [status, setStatus] =
    useState("confirming");

  const [message, setMessage] =
    useState(
      "결제를 최종 승인하고 있습니다."
    );

  const [result, setResult] =
    useState(null);

  const confirmStartedRef =
    useRef(false);

  useEffect(() => {
    if (
      confirmStartedRef.current
    ) {
      return;
    }

    confirmStartedRef.current =
      true;

    async function confirmPayment() {
      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {
        navigate("/login", {
          state: {
            from:
              window.location.pathname +
              window.location.search,
          },
          replace: true,
        });

        return;
      }

      const amount =
        Number(amountParam);

      if (
        !paymentKey ||
        !orderId ||
        !Number.isFinite(amount) ||
        amount <= 0
      ) {
        setStatus("failed");

        setMessage(
          "결제 승인에 필요한 정보가 올바르지 않습니다."
        );

        return;
      }

      try {
        const response =
          await api.post(
            "/payments/confirm",
            {
              paymentKey,
              orderId,
              amount,
            }
          );

        setResult(
          response.data
        );

        setStatus("success");

        setMessage(
          "결제가 정상적으로 승인되었습니다."
        );
      } catch (error) {
        console.error(
          "결제 승인 실패:",
          error.response?.status,
          error.response?.data,
          error
        );

        if (
          error.response?.status ===
          401
        ) {
          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "role"
          );

          navigate("/login", {
            state: {
              from:
                window.location.pathname +
                window.location.search,
            },
            replace: true,
          });

          return;
        }

        setStatus("failed");

        setMessage(
          error.response?.data
            ?.message ||
            error.response?.data
              ?.error ||
            "결제 승인에 실패했습니다."
        );
      }
    }

    confirmPayment();
  }, [
    paymentKey,
    orderId,
    amountParam,
    navigate,
  ]);

  function formatPrice(value) {
    return (
      Number(
        value || 0
      ).toLocaleString("ko-KR") +
      "원"
    );
  }

  if (
    status === "confirming"
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <section className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

          <h1 className="mt-6 text-2xl font-black">
            결제를 승인하고 있습니다
          </h1>

          <p className="mt-3 text-slate-400">
            창을 닫거나 새로고침하지
            말고 잠시 기다려 주세요.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex h-16 max-w-5xl items-center px-6">
          <Link
            to="/home"
            className="flex items-center gap-2 text-2xl font-bold text-cyan-400"
          >
            <Cpu size={27} />
            UpgradeHub
          </Link>
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-3xl items-center justify-center px-6 py-12">
        <section
          className={
            "w-full rounded-2xl border bg-slate-900 p-8 text-center sm:p-10 " +
            (status ===
            "success"
              ? "border-green-500/30"
              : "border-red-500/30")
          }
        >
          {status ===
          "success" ? (
            <CheckCircle2
              size={64}
              className="mx-auto text-green-400"
            />
          ) : (
            <XCircle
              size={64}
              className="mx-auto text-red-400"
            />
          )}

          <p
            className={
              "mt-6 text-sm font-bold tracking-widest " +
              (status ===
              "success"
                ? "text-green-400"
                : "text-red-400")
            }
          >
            {status ===
            "success"
              ? "PAYMENT COMPLETE"
              : "PAYMENT FAILED"}
          </p>

          <h1 className="mt-2 text-3xl font-black">
            {status ===
            "success"
              ? "결제가 완료되었습니다"
              : "결제를 완료하지 못했습니다"}
          </h1>

          <p className="mt-4 text-slate-300">
            {message}
          </p>

          {status ===
            "success" && (
            <div className="mt-7 space-y-3 rounded-xl border border-slate-800 bg-slate-950 p-5 text-left">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">
                  주문번호
                </span>

                <strong className="break-all text-right">
                  {result?.orderId ??
                    orderId}
                </strong>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-500">
                  결제 금액
                </span>

                <strong className="text-cyan-400">
                  {formatPrice(
                    result?.amount ??
                      amountParam
                  )}
                </strong>
              </div>

              {result?.status && (
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    주문 상태
                  </span>

                  <strong className="text-green-400">
                    {
                      result.status
                    }
                  </strong>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link
              to="/orders"
              className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3.5 font-black text-slate-950 transition hover:bg-cyan-400"
            >
              <Package size={19} />
              주문 내역 확인
            </Link>

            <Link
              to="/home"
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-3.5 font-bold text-slate-300 transition hover:border-cyan-500 hover:text-cyan-400"
            >
              <Home size={19} />
              홈으로 이동
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default PaymentSuccessPage;