import {
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react";

import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

function AdminLayout() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/login", {
      replace: true,
    });
  }

  const menuItems = [
    {
      to: "/admin",
      label: "대시보드",
      icon: LayoutDashboard,
      end: true,
    },
    {
      to: "/admin/products",
      label: "상품 관리",
      icon: Package,
    },
    {
      to: "/admin/users",
      label: "사용자 관리",
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-800 bg-slate-900 lg:block">
        <div className="border-b border-slate-800 p-6">
          <button
            type="button"
            onClick={() => {
              navigate("/home");
            }}
            className="flex items-center gap-2 text-2xl font-black text-cyan-400"
          >
            <ShoppingBag size={26} />
            UpgradeHub
          </button>

          <p className="mt-2 text-xs font-bold tracking-widest text-slate-500">
            ADMIN CONSOLE
          </p>
        </div>

        <nav className="space-y-2 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({
                  isActive,
                }) =>
                  "flex items-center gap-3 rounded-xl px-4 py-3 font-semibold transition " +
                  (isActive
                    ? "bg-cyan-500 text-slate-950"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white")
                }
              >
                <Icon size={19} />

                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-900/95 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div>
              <p className="font-bold">
                관리자 페이지
              </p>

              <p className="text-xs text-slate-500">
                상품과 사용자를 관리합니다.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  navigate("/home");
                }}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-500 hover:text-cyan-400"
              >
                사이트로 이동
              </button>

              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-2 rounded-lg border border-red-500/30 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500/10"
              >
                <LogOut size={16} />
                로그아웃
              </button>
            </div>
          </div>

          <nav className="flex gap-2 overflow-x-auto border-t border-slate-800 p-3 lg:hidden">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({
                    isActive,
                  }) =>
                    "flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold " +
                    (isActive
                      ? "bg-cyan-500 text-slate-950"
                      : "bg-slate-800 text-slate-300")
                  }
                >
                  <Icon size={16} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;