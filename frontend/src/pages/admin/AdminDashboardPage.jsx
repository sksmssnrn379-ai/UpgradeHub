import {
  Package,
  ShieldCheck,
  Users,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

function AdminDashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-7xl">
      <p className="text-sm font-bold tracking-widest text-cyan-400">
        ADMIN DASHBOARD
      </p>

      <h1 className="mt-2 text-3xl font-black">
        관리자 대시보드
      </h1>

      <p className="mt-3 text-slate-400">
        UpgradeHub의 상품과 사용자를
        관리할 수 있습니다.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <button
          type="button"
          onClick={() => {
            navigate("/admin/products");
          }}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-7 text-left transition hover:border-cyan-500/50"
        >
          <Package
            size={32}
            className="text-cyan-400"
          />

          <h2 className="mt-5 text-xl font-bold">
            상품 관리
          </h2>

          <p className="mt-2 text-slate-400">
            상품 등록, 수정, 이미지,
            재고와 판매 상태를 관리합니다.
          </p>
        </button>

        <button
          type="button"
          onClick={() => {
            navigate("/admin/users");
          }}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-7 text-left transition hover:border-cyan-500/50"
        >
          <Users
            size={32}
            className="text-violet-400"
          />

          <h2 className="mt-5 text-xl font-bold">
            사용자 관리
          </h2>

          <p className="mt-2 text-slate-400">
            사용자 권한과 계정 상태를
            관리합니다.
          </p>
        </button>
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 p-5 text-green-300">
        <ShieldCheck size={22} />

        관리자 권한으로 접속했습니다.
      </div>
    </div>
  );
}

export default AdminDashboardPage;