import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  Cpu,
  Package,
  Receipt,
  RefreshCw,
  ShoppingBag,
  ShoppingCart,
  XCircle,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import api from "../api/axios.js";

const ORDER_STATUS = {
  PAYMENT_PENDING: {
    label: "결제 대기",
    className:
      "border-amber-500/30 bg-amber-500/10 text-amber-300",
    icon: Clock3,
  },

  PAID: {
    label: "결제 완료",
    className:
      "border-green-500/30 bg-green-500/10 text-green-300",
    icon: CheckCircle2,
  },

  ORDERED: {
    label: "주문 완료",
    className:
      "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
    icon: ShoppingBag,
  },

  PAYMENT_FAILED: {
    label: "결제 실패",
    className:
      "border-red-500/30 bg-red-500/10 text-red-300",
    icon: XCircle,
  },

  CANCELLED: {
    label: "주문 취소",
    className:
      "border-red-500/30 bg-red-500/10 text-red-300",
    icon: XCircle,
  },

  COMPLETED: {
    label: "처리 완료",
    className:
      "border-violet-500/30 bg-violet-500/10 text-violet-300",
    icon: CheckCircle2,
  },
};

function getOrderStatus(status) {
  return (
    ORDER_STATUS[status] || {
      label: status || "상태 정보 없음",
      className:
        "border-slate-600 bg-slate-800 text-slate-300",
      icon: Package,
    }
  );
}

function formatPrice(price) {
  return (
    Number(
      price || 0
    ).toLocaleString("ko-KR") +
    "원"
  );
}

function formatOrderDate(value) {
  if (!value) {
    return "주문 일시 정보 없음";
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return String(value);
  }

  return new Intl.DateTimeFormat(
    "ko-KR",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
}

function OrdersPage() {
  const navigate = useNavigate();

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [
    expandedOrderIds,
    setExpandedOrderIds,
  ] = useState(() => new Set());

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  useEffect(() => {
  console.log("OrdersPage 진입");
}, []);

  async function loadOrders() {
    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/login", {
        state: {
          from: "/orders",
        },
        replace: true,
      });

      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response =
        await api.get("/orders");

      const orderData =
        Array.isArray(response.data)
          ? response.data
          : [];

      setOrders(orderData);

      setExpandedOrderIds(
        new Set(
          orderData.map(
            (order) =>
              order.orderId
          )
        )
      );
    } catch (error) {
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
            from: "/orders",
          },
          replace: true,
        });

        return;
      }

      setMessage(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "주문 내역을 불러오지 못했습니다."
      );
    } finally {
      setLoading(false);
    }
  }

  function toggleOrder(orderId) {
    setExpandedOrderIds(
      (current) => {
        const next =
          new Set(current);

        if (next.has(orderId)) {
          next.delete(orderId);
        } else {
          next.add(orderId);
        }

        return next;
      }
    );
  }

  function handleLogout() {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "role"
    );

    navigate("/home", {
      replace: true,
    });
  }

  const filteredOrders =
    useMemo(() => {
      if (
        statusFilter === "ALL"
      ) {
        return orders;
      }

      return orders.filter(
        (order) =>
          order.status ===
          statusFilter
      );
    }, [
      orders,
      statusFilter,
    ]);

  const paidOrderCount =
    useMemo(() => {
      return orders.filter(
        (order) =>
          order.status === "PAID" ||
          order.status ===
            "COMPLETED"
      ).length;
    }, [orders]);

  const pendingOrderCount =
    useMemo(() => {
      return orders.filter(
        (order) =>
          order.status ===
          "PAYMENT_PENDING"
      ).length;
    }, [orders]);

  const paidTotal =
    useMemo(() => {
      return orders
        .filter(
          (order) =>
            order.status === "PAID" ||
            order.status ===
              "COMPLETED"
        )
        .reduce(
          (sum, order) =>
            sum +
            Number(
              order.totalPrice || 0
            ),
          0
        );
    }, [orders]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-6 px-6 py-3">
          <Link
            to="/home"
            className="flex items-center gap-2 text-2xl font-bold text-cyan-400"
          >
            <Cpu size={27} />
            UpgradeHub
          </Link>

          <nav className="flex flex-wrap items-center justify-end gap-5 text-sm">
            <Link
              to="/products"
              className="transition hover:text-cyan-400"
            >
              PRODUCTS
            </Link>

            <Link
              to="/mypc"
              className="transition hover:text-cyan-400"
            >
              MY PC
            </Link>

            <Link
              to="/orders"
              className="font-bold text-cyan-400"
            >
              ORDERS
            </Link>

            <Link
              to="/advisor"
              className="transition hover:text-cyan-400"
            >
              AI ADVISOR
            </Link>

            <Link
              to="/cart"
              className="flex items-center gap-2 transition hover:text-cyan-400"
            >
              <ShoppingCart
                size={18}
              />
              CART
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="transition hover:text-red-400"
            >
              LOGOUT
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <button
          type="button"
          onClick={() => {
            navigate("/home");
          }}
          className="mb-7 flex items-center gap-2 text-sm text-slate-400 transition hover:text-cyan-400"
        >
          <ArrowLeft size={17} />
          홈으로 돌아가기
        </button>

        <section className="mb-8 overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 to-cyan-950 p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-2 text-sm font-bold tracking-widest text-cyan-400">
                ORDER HISTORY
              </p>

              <h1 className="text-4xl font-black md:text-5xl">
                주문 내역
              </h1>

              <p className="mt-3 max-w-2xl leading-7 text-slate-300">
                주문한 상품과 결제 상태,
                수량 및 주문 금액을
                확인할 수 있습니다.
              </p>
            </div>

            <button
              type="button"
              onClick={loadOrders}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-3 font-bold text-slate-300 transition hover:border-cyan-500 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={18}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              새로고침
            </button>
          </div>
        </section>

        {!loading &&
          !message &&
          orders.length > 0 && (
            <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">
                      전체 주문
                    </p>

                    <p className="mt-2 text-3xl font-black">
                      {orders.length}
                    </p>
                  </div>

                  <Receipt
                    size={30}
                    className="text-cyan-400"
                  />
                </div>
              </article>

              <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">
                      결제 완료
                    </p>

                    <p className="mt-2 text-3xl font-black">
                      {paidOrderCount}
                    </p>
                  </div>

                  <CheckCircle2
                    size={30}
                    className="text-green-400"
                  />
                </div>
              </article>

              <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">
                      결제 대기
                    </p>

                    <p className="mt-2 text-3xl font-black">
                      {pendingOrderCount}
                    </p>
                  </div>

                  <Clock3
                    size={30}
                    className="text-amber-400"
                  />
                </div>
              </article>

              <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">
                      결제 완료 금액
                    </p>

                    <p className="mt-2 text-xl font-black text-cyan-400">
                      {formatPrice(
                        paidTotal
                      )}
                    </p>
                  </div>

                  <ShoppingBag
                    size={30}
                    className="text-violet-400"
                  />
                </div>
              </article>
            </section>
          )}

        {!loading &&
          !message &&
          orders.length > 0 && (
            <section className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold">
                  주문 상태 필터
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  확인할 주문 상태를
                  선택하세요.
                </p>
              </div>

              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(
                    event.target.value
                  );
                }}
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
              >
                <option value="ALL">
                  전체 주문
                </option>

                <option value="PAYMENT_PENDING">
                  결제 대기
                </option>

                <option value="PAID">
                  결제 완료
                </option>

                <option value="ORDERED">
                  주문 완료
                </option>

                <option value="PAYMENT_FAILED">
                  결제 실패
                </option>

                <option value="CANCELLED">
                  주문 취소
                </option>

                <option value="COMPLETED">
                  처리 완료
                </option>
              </select>
            </section>
          )}

        {loading && (
          <section className="rounded-2xl border border-slate-800 bg-slate-900 py-20 text-center">
            <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

            <p className="text-slate-400">
              주문 내역을 불러오는 중입니다.
            </p>
          </section>
        )}

        {!loading && message && (
          <section className="rounded-2xl border border-red-500/30 bg-red-500/10 p-10 text-center">
            <XCircle
              size={48}
              className="mx-auto text-red-400"
            />

            <h2 className="mt-5 text-2xl font-bold text-red-300">
              주문 내역을 확인할 수 없습니다.
            </h2>

            <p className="mt-3 text-red-200">
              {message}
            </p>

            <button
              type="button"
              onClick={loadOrders}
              className="mt-7 rounded-xl bg-red-500 px-6 py-3 font-bold text-white transition hover:bg-red-400"
            >
              다시 시도
            </button>
          </section>
        )}

        {!loading &&
          !message &&
          orders.length === 0 && (
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-14 text-center">
              <Package
                size={56}
                className="mx-auto text-slate-600"
              />

              <h2 className="mt-5 text-2xl font-bold">
                주문 내역이 없습니다.
              </h2>

              <p className="mt-3 text-slate-400">
                상품을 주문하면 이곳에서
                주문 내역을 확인할 수 있습니다.
              </p>

              <Link
                to="/products"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-black text-slate-950 transition hover:bg-cyan-400"
              >
                <ShoppingCart
                  size={18}
                />

                상품 둘러보기
              </Link>
            </section>
          )}

        {!loading &&
          !message &&
          orders.length > 0 &&
          filteredOrders.length ===
            0 && (
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-14 text-center">
              <Package
                size={52}
                className="mx-auto text-slate-600"
              />

              <h2 className="mt-5 text-xl font-bold">
                해당 상태의 주문이 없습니다.
              </h2>

              <button
                type="button"
                onClick={() => {
                  setStatusFilter(
                    "ALL"
                  );
                }}
                className="mt-6 rounded-xl border border-slate-700 px-6 py-3 font-bold text-slate-300 transition hover:border-cyan-500 hover:text-cyan-400"
              >
                전체 주문 보기
              </button>
            </section>
          )}

        {!loading &&
          !message &&
          filteredOrders.length >
            0 && (
            <section className="space-y-5">
              {filteredOrders.map(
                (order) => {
                  const statusInfo =
                    getOrderStatus(
                      order.status
                    );

                  const StatusIcon =
                    statusInfo.icon;

                  const expanded =
                    expandedOrderIds.has(
                      order.orderId
                    );

                  const items =
                    Array.isArray(
                      order.items
                    )
                      ? order.items
                      : [];

                  const itemCount =
                    items.reduce(
                      (sum, item) =>
                        sum +
                        Number(
                          item.quantity ||
                            0
                        ),
                      0
                    );

                  return (
                    <article
                      key={
                        order.orderId
                      }
                      className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          toggleOrder(
                            order.orderId
                          );
                        }}
                        className="flex w-full flex-col gap-5 p-6 text-left transition hover:bg-slate-800/40 md:flex-row md:items-center md:justify-between"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-800">
                            <Receipt
                              size={24}
                              className="text-cyan-400"
                            />
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-3">
                              <h2 className="text-xl font-black">
                                주문번호{" "}
                                {
                                  order.orderId
                                }
                              </h2>

                              <span
                                className={
                                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold " +
                                  statusInfo.className
                                }
                              >
                                <StatusIcon
                                  size={14}
                                />

                                {
                                  statusInfo.label
                                }
                              </span>
                            </div>

                            <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                              <CalendarDays
                                size={16}
                              />

                              {formatOrderDate(
                                order.orderedAt
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-6 md:justify-end">
                          <div className="text-right">
                            <p className="text-sm text-slate-500">
                              상품{" "}
                              {itemCount}개
                            </p>

                            <p className="mt-1 text-xl font-black text-cyan-400">
                              {formatPrice(
                                order.totalPrice
                              )}
                            </p>
                          </div>

                          {expanded ? (
                            <ChevronUp
                              size={22}
                              className="text-slate-400"
                            />
                          ) : (
                            <ChevronDown
                              size={22}
                              className="text-slate-400"
                            />
                          )}
                        </div>
                      </button>

                      {expanded && (
                        <div className="border-t border-slate-800 p-5 sm:p-6">
                          <div className="mb-4 flex items-center justify-between gap-4">
                            <h3 className="font-bold">
                              주문 상품
                            </h3>

                            <span className="text-sm text-slate-500">
                              총{" "}
                              {items.length}
                              종
                            </span>
                          </div>

                          <div className="space-y-3">
                            {items.map(
                              (
                                item,
                                index
                              ) => (
                                <article
                                  key={
                                    item.productId +
                                    "-" +
                                    index
                                  }
                                  className="grid gap-4 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:grid-cols-[64px_minmax(0,1fr)_auto] sm:items-center"
                                >
                                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-800">
                                    <Package
                                      size={28}
                                      className="text-cyan-400"
                                    />
                                  </div>

                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold text-slate-500">
                                      {
                                        item.brand
                                      }
                                    </p>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        navigate(
                                          `/products/${item.productId}`,
                                          {
                                            state:
                                              {
                                                from:
                                                  "/orders",
                                              },
                                          }
                                        );
                                      }}
                                      className="mt-1 break-words text-left text-lg font-bold transition hover:text-cyan-400"
                                    >
                                      {
                                        item.productName
                                      }
                                    </button>

                                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-400">
                                      <span>
                                        주문 단가{" "}
                                        <strong className="text-slate-200">
                                          {formatPrice(
                                            item.orderPrice
                                          )}
                                        </strong>
                                      </span>

                                      <span>
                                        수량{" "}
                                        <strong className="text-slate-200">
                                          {
                                            item.quantity
                                          }
                                          개
                                        </strong>
                                      </span>
                                    </div>
                                  </div>

                                  <div className="text-left sm:text-right">
                                    <p className="text-sm text-slate-500">
                                      상품 합계
                                    </p>

                                    <p className="mt-1 text-lg font-black text-cyan-400">
                                      {formatPrice(
                                        item.subtotal
                                      )}
                                    </p>
                                  </div>
                                </article>
                              )
                            )}
                          </div>

                          <div className="mt-5 flex flex-col justify-between gap-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5 sm:flex-row sm:items-center">
                            <div>
                              <p className="text-sm text-slate-400">
                                주문 상태
                              </p>

                              <p className="mt-1 font-bold">
                                {
                                  statusInfo.label
                                }
                              </p>
                            </div>

                            <div className="sm:text-right">
                              <p className="text-sm text-slate-400">
                                총 주문 금액
                              </p>

                              <p className="mt-1 text-2xl font-black text-cyan-400">
                                {formatPrice(
                                  order.totalPrice
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                }
              )}
            </section>
          )}
      </main>
    </div>
  );
}

export default OrdersPage;