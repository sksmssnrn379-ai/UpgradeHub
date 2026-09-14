import {
  CheckCircle2,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import api from "../api/axios.js";

function PaymentSuccessPage() {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const [message, setMessage] =
    useState("결제를 승인하고 있습니다.");

  const [success, setSuccess] =
    useState(false);

  useEffect(() => {
    let active = true;

    async function confirmPayment() {
      const paymentKey =
        searchParams.get("paymentKey");

      const orderId =
        searchParams.get("orderId");

      const amount =
        Number(
          searchParams.get("amount")
        );

      if (
        !paymentKey ||
        !orderId ||
        !Number.isFinite(amount)
      ) {
        setMessage(
          "결제 승인 정보가 올바르지 않습니다."
        );

        return;
      }

      try {
        await api.post(
          "/payments/confirm",
          {
            paymentKey: paymentKey,
            orderId: orderId,
            amount: amount,
          }
        );

        if (active) {
          setSuccess(true);
          setMessage(
            "결제가 완료되었습니다."
          );
        }
      } catch (error) {
        if (active) {
          setMessage(
            error.response?.data
              ?.message ||
              "결제 승인에 실패했습니다."
          );
        }
      }
    }

    confirmPayment();

    return () => {
      active = false;
    };
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <section className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
        <CheckCircle2
          size={54}
          className={
            "mx-auto " +
            (success
              ? "text-green-400"
              : "text-slate-500")
          }
        />

        <h1 className="mt-6 text-3xl font-black">
          {success
            ? "결제 완료"
            : "결제 처리 중"}
        </h1>

        <p className="mt-4 text-slate-400">
          {message}
        </p>

        {success && (
          <button
            type="button"
            onClick={() => {
              navigate("/orders", {
                replace: true,
              });
            }}
            className="mt-7 w-full rounded-xl bg-cyan-500 py-3 font-black text-slate-950"
          >
            주문 내역 확인
          </button>
        )}
      </section>
    </div>
  );
}

export default PaymentSuccessPage;