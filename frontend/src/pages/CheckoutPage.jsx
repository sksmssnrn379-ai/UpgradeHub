import {
  loadTossPayments,
} from "@tosspayments/tosspayments-sdk";

import {
  CreditCard,
  Cpu,
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

function CheckoutPage() {
  const navigate = useNavigate();

  const [paymentData, setPaymentData] =
    useState(null);

  const [widgets, setWidgets] =
    useState(null);

  const [ready, setReady] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [paying, setPaying] =
    useState(false);

  useEffect(() => {
    let active = true;

    async function initializePayment() {
      try {
        const response =
          await api.post(
            "/payments/prepare"
          );

        if (!active) {
          return;
        }

        const preparedPayment =
          response.data;

        setPaymentData(preparedPayment);

        const tossPayments =
          await loadTossPayments(
            import.meta.env
              .VITE_TOSS_CLIENT_KEY
          );

        const customerKey =
          crypto.randomUUID();

        const paymentWidgets =
          tossPayments.widgets({
            customerKey: customerKey,
          });

        await paymentWidgets.setAmount({
          currency: "KRW",
          value:
            preparedPayment.amount,
        });

        await paymentWidgets
          .renderPaymentMethods({
            selector:
              "#payment-method",
            variantKey: "DEFAULT",
          });

        await paymentWidgets
          .renderAgreement({
            selector:
              "#agreement",
            variantKey: "AGREEMENT",
          });

        if (active) {
          setWidgets(paymentWidgets);
          setReady(true);
        }
      } catch (error) {
        if (
          error.response?.status === 401
        ) {
          localStorage.removeItem(
            "token"
          );

          navigate("/login", {
            state: {
              from: "/checkout",
            },
            replace: true,
          });

          return;
        }

        setMessage(
          error.response?.data?.message ||
            error.message ||
            "결제 정보를 준비하지 못했습니다."
        );
      }
    }

    initializePayment();

    return () => {
      active = false;
    };
  }, [navigate]);

  async function requestPayment() {
    if (
      !widgets ||
      !paymentData ||
      !ready
    ) {
      return;
    }

    setPaying(true);
    setMessage("");

    try {
      await widgets.requestPayment({
        orderId:
          paymentData.paymentOrderId,

        orderName:
          paymentData.orderName,

        successUrl:
          window.location.origin +
          "/payment/success",

        failUrl:
          window.location.origin +
          "/payment/fail",

        customerEmail:
          paymentData.customerEmail,

        customerName:
          paymentData.customerName,
      });
    } catch (error) {
      setMessage(
        error.message ||
          "결제창을 열지 못했습니다."
      );

      setPaying(false);
    }
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

      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        <p className="text-sm font-bold tracking-widest text-cyan-400">
          SECURE CHECKOUT
        </p>

        <h1 className="mt-2 text-4xl font-white">
          결제하기
        </h1>

        {paymentData && (
          <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">
                주문 상품
              </span>

              <strong className="text-right">
                {paymentData.orderName}
              </strong>
            </div>

            <div className="mt-4 flex justify-between gap-4">
              <span className="text-slate-400">
                결제 금액
              </span>

              <strong className="text-2xl text-cyan-400">
                {Number(
                  paymentData.amount
                ).toLocaleString("ko-KR")}
                원
              </strong>
            </div>
          </section>
        )}

        <section className="mt-6 overflow-hidden rounded-2xl bg-white text-slate-950">
          <div id="payment-method" />
          <div id="agreement" />
        </section>

        {message && (
          <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {message}
          </div>
        )}

        <button
          type="button"
          disabled={
            !ready || paying
          }
          onClick={requestPayment}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-4 font-black text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CreditCard size={20} />

          {paying
            ? "결제창을 여는 중..."
            : "결제하기"}
        </button>
      </main>
    </div>
  );
}

export default CheckoutPage;