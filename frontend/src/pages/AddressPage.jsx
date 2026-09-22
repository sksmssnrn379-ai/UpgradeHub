import {
  ArrowLeft,
  CheckCircle2,
  Cpu,
  Edit3,
  Home,
  MapPin,
  Plus,
  RefreshCw,
  Save,
  Star,
  Trash2,
  X,
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

const EMPTY_FORM = {
  addressName: "",
  recipientName: "",
  phone: "",
  postalCode: "",
  roadAddress: "",
  detailAddress: "",
  defaultAddress: false,
};

function AddressPage() {
  const navigate = useNavigate();

  const [addresses, setAddresses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [changingId, setChangingId] =
    useState(null);

  const [form, setForm] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState("");

  useEffect(() => {
    loadAddresses();
  }, []);

  async function loadAddresses() {
    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/login", {
        state: {
          from: "/addresses",
        },
        replace: true,
      });

      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response =
        await api.get("/addresses");

      setAddresses(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "role"
        );

        navigate("/login", {
          state: {
            from: "/addresses",
          },
          replace: true,
        });

        return;
      }

      setMessage(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "배송지 목록을 불러오지 못했습니다."
      );

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  function openCreateForm() {
    setForm({
      ...EMPTY_FORM,
      defaultAddress:
        addresses.length === 0,
    });

    setMessage("");
  }

  function openEditForm(address) {
    setForm({
      id: address.id,
      addressName:
        address.addressName || "",
      recipientName:
        address.recipientName || "",
      phone:
        address.phone || "",
      postalCode:
        address.postalCode || "",
      roadAddress:
        address.roadAddress || "",
      detailAddress:
        address.detailAddress || "",
      defaultAddress:
        Boolean(
          address.defaultAddress
        ),
    });

    setMessage("");
  }

  function closeForm() {
    if (saving) {
      return;
    }

    setForm(null);
  }

  function updateForm(
    field,
    value
  ) {
    setForm((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        [field]: value,
      };
    });
  }

  function validateForm() {
    if (!form) {
      return false;
    }

    if (!form.addressName.trim()) {
      setMessage(
        "배송지 이름을 입력해 주세요."
      );

      setMessageType("error");
      return false;
    }

    if (!form.recipientName.trim()) {
      setMessage(
        "받는 사람 이름을 입력해 주세요."
      );

      setMessageType("error");
      return false;
    }

    if (!form.phone.trim()) {
      setMessage(
        "전화번호를 입력해 주세요."
      );

      setMessageType("error");
      return false;
    }

    const phonePattern =
      /^[0-9-]{9,20}$/;

    if (
      !phonePattern.test(
        form.phone.trim()
      )
    ) {
      setMessage(
        "전화번호 형식이 올바르지 않습니다."
      );

      setMessageType("error");
      return false;
    }

    const postalCodePattern =
      /^[0-9]{5}$/;

    if (
      !postalCodePattern.test(
        form.postalCode.trim()
      )
    ) {
      setMessage(
        "우편번호는 숫자 5자리로 입력해 주세요."
      );

      setMessageType("error");
      return false;
    }

    if (!form.roadAddress.trim()) {
      setMessage(
        "도로명 주소를 입력해 주세요."
      );

      setMessageType("error");
      return false;
    }

    return true;
  }

  async function saveAddress(
    event
  ) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload = {
      addressName:
        form.addressName.trim(),

      recipientName:
        form.recipientName.trim(),

      phone:
        form.phone.trim(),

      postalCode:
        form.postalCode.trim(),

      roadAddress:
        form.roadAddress.trim(),

      detailAddress:
        form.detailAddress.trim() ||
        null,

      defaultAddress:
        Boolean(
          form.defaultAddress
        ),
    };

    setSaving(true);
    setMessage("");

    try {
      if (form.id) {
        await api.put(
          `/addresses/${form.id}`,
          payload
        );

        setMessage(
          "배송지가 수정되었습니다."
        );
      } else {
        await api.post(
          "/addresses",
          payload
        );

        setMessage(
          "배송지가 등록되었습니다."
        );
      }

      setMessageType("success");
      setForm(null);

      await loadAddresses();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "배송지를 저장하지 못했습니다."
      );

      setMessageType("error");
    } finally {
      setSaving(false);
    }
  }

  async function setDefaultAddress(
    address
  ) {
    if (address.defaultAddress) {
      return;
    }

    setChangingId(address.id);
    setMessage("");

    try {
      await api.put(
        `/addresses/${address.id}/default`
      );

      setMessage(
        "기본 배송지가 변경되었습니다."
      );

      setMessageType("success");

      await loadAddresses();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "기본 배송지를 변경하지 못했습니다."
      );

      setMessageType("error");
    } finally {
      setChangingId(null);
    }
  }

  async function deleteAddress(
    address
  ) {
    const confirmed =
      window.confirm(
        `${address.addressName} 배송지를 삭제할까요?`
      );

    if (!confirmed) {
      return;
    }

    setChangingId(address.id);
    setMessage("");

    try {
      await api.delete(
        `/addresses/${address.id}`
      );

      setMessage(
        "배송지가 삭제되었습니다."
      );

      setMessageType("success");

      await loadAddresses();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "배송지를 삭제하지 못했습니다."
      );

      setMessageType("error");
    } finally {
      setChangingId(null);
    }
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

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
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
              className="transition hover:text-cyan-400"
            >
              ORDERS
            </Link>

            <Link
              to="/addresses"
              className="font-bold text-cyan-400"
            >
              ADDRESSES
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

      <main className="mx-auto max-w-6xl px-6 py-10">
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
              <p className="text-sm font-bold tracking-widest text-cyan-400">
                DELIVERY ADDRESS
              </p>

              <h1 className="mt-2 text-4xl font-black md:text-5xl">
                배송지 관리
              </h1>

              <p className="mt-3 max-w-2xl leading-7 text-slate-300">
                주문에 사용할 배송지를
                등록하고 기본 배송지를
                설정할 수 있습니다.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={loadAddresses}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-3 font-bold text-slate-300 transition hover:border-cyan-500 hover:text-cyan-400 disabled:opacity-50"
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

              <button
                type="button"
                onClick={openCreateForm}
                className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-black text-slate-950 transition hover:bg-cyan-400"
              >
                <Plus size={18} />
                배송지 등록
              </button>
            </div>
          </div>
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
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-16 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

            <p className="mt-5 text-slate-400">
              배송지 목록을 불러오는 중입니다.
            </p>
          </section>
        ) : addresses.length === 0 ? (
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-14 text-center">
            <MapPin
              size={54}
              className="mx-auto text-slate-600"
            />

            <h2 className="mt-5 text-2xl font-bold">
              등록된 배송지가 없습니다.
            </h2>

            <p className="mt-3 text-slate-400">
              배송지를 등록하면 결제 화면에서
              선택할 수 있습니다.
            </p>

            <button
              type="button"
              onClick={openCreateForm}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-black text-slate-950 transition hover:bg-cyan-400"
            >
              <Plus size={18} />
              첫 배송지 등록
            </button>
          </section>
        ) : (
          <section className="grid gap-5 md:grid-cols-2">
            {addresses.map(
              (address) => {
                const isChanging =
                  changingId ===
                  address.id;

                return (
                  <article
                    key={address.id}
                    className={
                      "rounded-2xl border bg-slate-900 p-6 " +
                      (address.defaultAddress
                        ? "border-cyan-500/50"
                        : "border-slate-800")
                    }
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-xl font-black">
                            {
                              address.addressName
                            }
                          </h2>

                          {address.defaultAddress && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-300">
                              <Star
                                size={13}
                              />
                              기본 배송지
                            </span>
                          )}
                        </div>

                        <p className="mt-3 text-lg font-bold">
                          {
                            address.recipientName
                          }
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                          {address.phone}
                        </p>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800">
                        {address.defaultAddress ? (
                          <Home
                            size={24}
                            className="text-cyan-400"
                          />
                        ) : (
                          <MapPin
                            size={24}
                            className="text-slate-500"
                          />
                        )}
                      </div>
                    </div>

                    <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4">
                      <p className="text-sm text-slate-500">
                        우편번호{" "}
                        {address.postalCode}
                      </p>

                      <p className="mt-2 leading-7 text-slate-200">
                        {address.roadAddress}
                      </p>

                      {address.detailAddress && (
                        <p className="mt-1 leading-7 text-slate-400">
                          {
                            address.detailAddress
                          }
                        </p>
                      )}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          openEditForm(
                            address
                          );
                        }}
                        disabled={isChanging}
                        className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 font-bold text-slate-300 transition hover:border-cyan-500 hover:text-cyan-400 disabled:opacity-50"
                      >
                        <Edit3 size={16} />
                        수정
                      </button>

                      {!address.defaultAddress && (
                        <button
                          type="button"
                          onClick={() => {
                            setDefaultAddress(
                              address
                            );
                          }}
                          disabled={isChanging}
                          className="flex items-center gap-2 rounded-xl border border-green-500/30 px-4 py-2.5 font-bold text-green-300 transition hover:bg-green-500/10 disabled:opacity-50"
                        >
                          <CheckCircle2
                            size={16}
                          />

                          {isChanging
                            ? "변경 중..."
                            : "기본 배송지 설정"}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          deleteAddress(
                            address
                          );
                        }}
                        disabled={isChanging}
                        className="flex items-center gap-2 rounded-xl border border-red-500/30 px-4 py-2.5 font-bold text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                        삭제
                      </button>
                    </div>
                  </article>
                );
              }
            )}
          </section>
        )}

        {form && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4"
            onMouseDown={(event) => {
              if (
                event.target ===
                  event.currentTarget &&
                !saving
              ) {
                closeForm();
              }
            }}
          >
            <form
              onSubmit={saveAddress}
              className="my-8 w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold tracking-widest text-cyan-400">
                    ADDRESS FORM
                  </p>

                  <h2 className="mt-1 text-2xl font-black">
                    {form.id
                      ? "배송지 수정"
                      : "배송지 등록"}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  aria-label="배송지 입력 창 닫기"
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-bold text-slate-300">
                    배송지 이름
                  </span>

                  <input
                    value={
                      form.addressName
                    }
                    onChange={(event) => {
                      updateForm(
                        "addressName",
                        event.target.value
                      );
                    }}
                    placeholder="예: 집, 회사"
                    maxLength={50}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
                    required
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-bold text-slate-300">
                    받는 사람
                  </span>

                  <input
                    value={
                      form.recipientName
                    }
                    onChange={(event) => {
                      updateForm(
                        "recipientName",
                        event.target.value
                      );
                    }}
                    maxLength={50}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
                    required
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-bold text-slate-300">
                    전화번호
                  </span>

                  <input
                    value={form.phone}
                    onChange={(event) => {
                      updateForm(
                        "phone",
                        event.target.value
                      );
                    }}
                    placeholder="010-1234-5678"
                    maxLength={20}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
                    required
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-bold text-slate-300">
                    우편번호
                  </span>

                  <input
                    value={
                      form.postalCode
                    }
                    onChange={(event) => {
                      updateForm(
                        "postalCode",
                        event.target.value
                          .replace(
                            /[^0-9]/g,
                            ""
                          )
                          .slice(0, 5)
                      );
                    }}
                    placeholder="숫자 5자리"
                    inputMode="numeric"
                    maxLength={5}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
                    required
                  />
                </label>

                <label className="space-y-2 sm:col-span-2">
                  <span className="text-sm font-bold text-slate-300">
                    도로명 주소
                  </span>

                  <input
                    value={
                      form.roadAddress
                    }
                    onChange={(event) => {
                      updateForm(
                        "roadAddress",
                        event.target.value
                      );
                    }}
                    placeholder="도로명 주소를 입력하세요."
                    maxLength={255}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
                    required
                  />
                </label>

                <label className="space-y-2 sm:col-span-2">
                  <span className="text-sm font-bold text-slate-300">
                    상세 주소
                  </span>

                  <input
                    value={
                      form.detailAddress
                    }
                    onChange={(event) => {
                      updateForm(
                        "detailAddress",
                        event.target.value
                      );
                    }}
                    placeholder="동, 호수 또는 상세 위치"
                    maxLength={255}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
                  />
                </label>

                <label className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 p-4 sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={
                      form.defaultAddress
                    }
                    onChange={(event) => {
                      updateForm(
                        "defaultAddress",
                        event.target
                          .checked
                      );
                    }}
                    className="h-5 w-5 accent-cyan-500"
                  />

                  <span>
                    <strong className="block text-slate-200">
                      기본 배송지로 설정
                    </strong>

                    <span className="mt-1 block text-sm text-slate-500">
                      결제 화면에서 기본으로
                      선택됩니다.
                    </span>
                  </span>
                  
                </label>
                    </div>
              <div className="mt-7 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-xl border border-slate-700 px-5 py-3 font-bold text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
                >
                  취소
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-black text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save size={18} />

                  {saving
                    ? "저장 중..."
                    : "배송지 저장"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default AddressPage;