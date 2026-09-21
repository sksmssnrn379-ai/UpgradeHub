import {
  loadTossPayments,
} from "@tosspayments/tosspayments-sdk";

import {
  CreditCard,
  Cpu,
  MapPin,
  Plus,
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
  const [addresses, setAddresses] =
  useState([]);

const [
  selectedAddressId,
  setSelectedAddressId,
] = useState("");

const [
  loadingAddresses,
  setLoadingAddresses,
] = useState(true);
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

  async function initializeCheckout() {
    setLoadingAddresses(true);
    setMessage("");

    try {
      const addressResponse =
  await api.get("/addresses");

if (!active) {
  return;
}

const addressData =
  Array.isArray(addressResponse.data)
    ? addressResponse.data
    : [];

setAddresses(addressData);

const defaultAddress =
  addressData.find(
    (address) =>
      address.defaultAddress === true
  ) || addressData[0];

if (!defaultAddress) {
  setMessage(
    "결제를 진행하려면 배송지를 먼저 등록해 주세요."
  );

  return;
}

const addressId =
  Number(defaultAddress.id);

setSelectedAddressId(
  String(addressId)
);

console.log(
  "결제 준비에 사용할 주소:",
  addressId
);

const response =
  await api.post(
    "/payments/prepare",
    {
      addressId,
    }
  );

      if (!active) {
        return;
      }

      const preparedPayment =
        response.data;

      setPaymentData(
        preparedPayment
      );

      const tossPayments =
        await loadTossPayments(
          import.meta.env
            .VITE_TOSS_CLIENT_KEY
        );

      const customerKey =
        crypto.randomUUID();

      const paymentWidgets =
        tossPayments.widgets({
          customerKey,
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
        setWidgets(
          paymentWidgets
        );

        setReady(true);
      }
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

        localStorage.removeItem(
          "role"
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
          error.response?.data?.error ||
          error.message ||
          "결제 정보를 준비하지 못했습니다."
      );
    } finally {
      if (active) {
        setLoadingAddresses(false);
      }
    }
  }

  initializeCheckout();

  return () => {
    active = false;
  };
}, [navigate]);

  async function requestPayment() {
  if (!selectedAddressId) {
    setMessage(
      "배송지를 선택해 주세요."
    );

    return;
  }

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
      <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
  <div className="flex items-center justify-between gap-4">
    <div>
      <div className="flex items-center gap-2">
        <MapPin
          size={21}
          className="text-cyan-400"
        />

        <h2 className="text-xl font-black">
          배송지
        </h2>
      </div>

      <p className="mt-2 text-sm text-slate-400">
        주문 상품을 받을 배송지를
        확인해 주세요.
      </p>
    </div>

    <Link
      to="/addresses"
      className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-bold text-slate-300 transition hover:border-cyan-500 hover:text-cyan-400"
    >
      <Plus size={16} />
      배송지 관리
    </Link>
  </div>

  {loadingAddresses ? (
    <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-6 text-center text-slate-400">
      배송지 목록을 불러오는 중입니다.
    </div>
  ) : addresses.length === 0 ? (
    <div className="mt-5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-5">
      <p className="font-bold text-amber-300">
        등록된 배송지가 없습니다.
      </p>

      <p className="mt-2 text-sm text-slate-400">
        결제를 진행하려면 배송지를
        먼저 등록해야 합니다.
      </p>

      <Link
        to="/addresses"
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-black text-slate-950 transition hover:bg-cyan-400"
      >
        <Plus size={17} />
        배송지 등록
      </Link>
    </div>
  ) : (
    <div className="mt-5 space-y-3">
      {addresses.map(
        (address) => {
          const selected =
            String(address.id) ===
            selectedAddressId;

          return (
            <label
              key={address.id}
              className={
                "block cursor-pointer rounded-xl border p-4 transition " +
                (selected
                  ? "border-cyan-500 bg-cyan-500/10"
                  : "border-slate-800 bg-slate-950 hover:border-slate-700")
              }
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="deliveryAddress"
                  value={address.id}
                  checked={selected}
                  onChange={(event) => {
                    setSelectedAddressId(
                      event.target.value
                    );
                  }}
                  className="mt-1 h-4 w-4 accent-cyan-500"
                />

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <strong>
                      {address.addressName}
                    </strong>

                    {address.defaultAddress && (
                      <span className="rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs font-bold text-cyan-300">
                        기본 배송지
                      </span>
                    )}
                  </div>

                  <p className="mt-2 font-bold">
                    {address.recipientName}
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    {address.phone}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    [{address.postalCode}]{" "}
                    {address.roadAddress}
                    {address.detailAddress
                      ? ` ${address.detailAddress}`
                      : ""}
                  </p>
                </div>
              </div>
            </label>
          );
        }
      )}
    </div>
  )}
</section>
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
  !ready ||
  paying ||
  !selectedAddressId ||
  addresses.length === 0
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