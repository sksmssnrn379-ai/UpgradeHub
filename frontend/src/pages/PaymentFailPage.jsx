import {
  XCircle,
} from "lucide-react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

function PaymentFailPage() {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const message =
    searchParams.get("message") ||
    "결제가 완료되지 않았습니다.";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <section className="w-full max-w-lg rounded-2xl border border-red-500/30 bg-slate-900 p-10 text-center">
        <XCircle
          size={54}
          className="mx-auto text-red-400"
        />

        <h1 className="mt-6 text-3xl font-black">
          결제 실패
        </h1>

        <p className="mt-4 text-slate-400">
          {message}
        </p>

        <button
          type="button"
          onClick={() => {
            navigate("/cart", {
              replace: true,
            });
          }}
          className="mt-7 w-full rounded-xl bg-cyan-500 py-3 font-black text-slate-950"
        >
          장바구니로 돌아가기
        </button>
      </section>
    </div>
  );
}

export default PaymentFailPage;