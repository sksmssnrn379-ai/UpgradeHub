
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Cpu,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  PackageOpen,
  ArrowLeft,
  CreditCard,
} from "lucide-react";
import api from "../api/axios";

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ cartId: null, items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadCart() {
      setLoading(true);
      setMessage("");
      try {
        const response = await api.get("/cart");
        if (active) setCart(response.data);
      } catch (error) {
        if (!active) return;
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        setMessage(error.response?.data?.message || "장바구니를 불러오지 못했습니다.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadCart();
    return () => {
      active = false;
    };
  }, [navigate]);

  async function reloadCart() {
    try {
      const response = await api.get("/cart");
      setCart(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "장바구니를 불러오지 못했습니다.");
    }
  }

  async function changeQuantity(itemId, currentQuantity, amount) {
    const nextQuantity = currentQuantity + amount;
    if (nextQuantity < 1) return;
    setMessage("");
    try {
      await api.put(`/cart/items/${itemId}`, { quantity: nextQuantity });
      await reloadCart();
    } catch (error) {
      setMessage(error.response?.data?.message || "수량을 변경하지 못했습니다.");
    }
  }

  async function deleteItem(itemId) {
    if (!window.confirm("이 상품을 장바구니에서 삭제할까요?")) return;
    setMessage("");
    try {
      await api.delete(`/cart/items/${itemId}`);
      await reloadCart();
    } catch (error) {
      setMessage(error.response?.data?.message || "상품을 삭제하지 못했습니다.");
    }
  }

  async function clearCart() {
    if (cart.items.length === 0 || !window.confirm("장바구니를 전체 비울까요?")) return;
    setMessage("");
    try {
      await api.delete("/cart");
      await reloadCart();
    } catch (error) {
      setMessage(error.response?.data?.message || "장바구니를 비우지 못했습니다.");
    }
  }

  function createOrder() {
  if (cart.items.length === 0) {
    setMessage(
      "장바구니가 비어 있습니다."
    );

    return;
  }

  navigate("/checkout");
}

  function formatPrice(price) {
    return Number(price || 0).toLocaleString("ko-KR");
  }

  const totalCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <button onClick={() => navigate("/")} className="text-2xl font-bold text-cyan-400">
            UpgradeHub
          </button>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
            <button onClick={() => navigate("/products")} className="hover:text-cyan-400 transition">PRODUCTS</button>
            <button onClick={() => navigate("/mypc")} className="hover:text-cyan-400 transition">MY PC</button>
            <button onClick={() => navigate("/orders")} className="hover:text-cyan-400 transition">ORDERS</button>
            <button onClick={() => navigate("/ADDRESSES")} className="hover:text-cyan-400 transition">ADDRESSES</button>
            <span className="text-cyan-400">CART</span>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <button onClick={() => navigate("/products")} className="mb-6 flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition">
          <ArrowLeft size={17} /> 쇼핑 계속하기
        </button>

        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-cyan-400 text-lg font-bold tracking-widest mb-2">YOUR BUILD</p>
            <h1 className="text-4xl md:text-5xl ffont-bold text-white">SHOPPING CART</h1>
            <p className="text-slate-400 mt-2">선택한 PC 부품을 확인하고 주문을 진행하세요.</p>
          </div>
          {!loading && cart.items.length > 0 && (
            <div className="flex items-center gap-2 text-slate-300">
              <ShoppingCart size={20} className="text-cyan-400" />
              <span><strong className="text-white">{totalCount}</strong> items</span>
            </div>
          )}
        </div>

        {message && <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-300">{message}</div>}

        {loading ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-16 text-center text-slate-400">장바구니를 불러오는 중입니다.</div>
        ) : cart.items.length === 0 ? (
          <section className="rounded-2xl border border-slate-800 bg-slate-900 py-20 px-6 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-800">
              <PackageOpen size={42} className="text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">장바구니가 비어 있습니다.</h2>
            <p className="mt-2 text-slate-400">원하는 PC 부품을 장바구니에 담아보세요.</p>
            <button onClick={() => navigate("/products")} className="mt-7 rounded-lg bg-cyan-500 px-7 py-3 font-bold text-slate-950 hover:bg-cyan-400 transition">상품 보러 가기</button>
          </section>
        ) : (
          <div className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <section className="min-w-0 space-y-4">
              {cart.items.map((item) => (
                <article
                  key={item.itemId}
                  className="flex min-w-0 flex-col gap-5 rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700 md:grid md:grid-cols-[112px_minmax(0,1fr)] md:items-center xl:grid-cols-[112px_minmax(0,1fr)_auto]"
                >
                                  <div className="flex h-28 w-full shrink-0 items-center justify-center rounded-xl bg-slate-800 md:w-28">
                  <Cpu
                    size={48}
                    className="text-cyan-400"
                  />
                </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-green-400">{item.brand}</span>
                    <h2 className="mt-1 break-words text-xl font-bold text-white">{item.productName}</h2>
                    <p className="mt-2 text-sm text-slate-400">개당 {formatPrice(item.price)}원</p>
                  </div>
                 <div className="flex min-w-0 flex-wrap items-center justify-between gap-4 md:col-start-2 xl:col-start-auto xl:flex-nowrap xl:justify-end">
                    <div className="flex items-center rounded-lg border border-slate-700 bg-slate-950 overflow-hidden">
                      <button disabled={item.quantity <= 1} onClick={() => changeQuantity(item.itemId, item.quantity, -1)} className="p-2.5 text-slate-300 hover:bg-slate-800 hover:text-cyan-400 disabled:opacity-30"><Minus size={16} /></button>
                      <span className="w-10 text-center font-bold">{item.quantity}</span>
                      <button onClick={() => changeQuantity(item.itemId, item.quantity, 1)} className="p-2.5 text-slate-300 hover:bg-slate-800 hover:text-cyan-400"><Plus size={16} /></button>
                    </div>
                    <div className="min-w-28 text-right">
                      <strong className="block break-words text-lg text-cyan-400">{formatPrice(item.subtotal)}원</strong>
                      <button onClick={() => deleteItem(item.itemId)} className="mt-2 ml-auto flex items-center gap-1 text-xs text-slate-500 hover:text-red-400 transition"><Trash2 size={14} /> 삭제</button>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <aside className="w-full min-w-0 rounded-xl border border-cyan-500/30 bg-gradient-to-b from-slate-900 to-cyan-950/40 p-5 sm:p-6 xl:sticky xl:top-6 xl:self-start">
              <h2 className="text-2xl font-bold">ORDER SUMMARY</h2>
              <div className="mt-6 space-y-4 border-b border-slate-700 pb-6 text-sm">
                <div className="flex justify-between text-slate-400"><span>총 상품 수</span><span className="text-white font-semibold">{totalCount}개</span></div>
                <div className="flex justify-between text-slate-400"><span>배송비</span><span className="text-green-400 font-semibold">무료</span></div>
              </div>
              <div className="flex flex-wrap items-end justify-between gap-3 py-6">
                <span className="font-semibold">총 주문 금액</span>
                <strong className="whitespace-nowrap text-2xl text-cyan-400">{formatPrice(cart.totalPrice)}원</strong>
              </div>
              <button disabled={ordering} onClick={createOrder} className="w-full rounded-lg bg-cyan-500 py-3.5 font-bold text-white text-slate-950 flex items-center justify-center gap-2 hover:bg-cyan-400 disabled:opacity-50 transition">
                <CreditCard size={19} /> {ordering ? "주문 처리 중..." : "주문하기"}
              </button>
              <button onClick={clearCart} className="mt-3 w-full rounded-lg border border-slate-700 py-3 text-sm text-slate-400 hover:border-red-500/50 hover:text-red-400 transition">장바구니 비우기</button>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
