import {
  Ban,
  CheckCircle2,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "../../api/axios.js";

function AdminUsersPage() {
  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [changingUserId, setChangingUserId] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [roleFilter, setRoleFilter] =
    useState("ALL");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    setMessage("");

    try {
      const response =
        await api.get(
          "/admin/users"
        );

      setUsers(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      if (
        error.response?.status === 401
      ) {
        setMessage(
          "로그인이 필요하거나 로그인 정보가 만료되었습니다."
        );
      } else if (
        error.response?.status === 403
      ) {
        setMessage(
          "사용자 목록을 조회할 관리자 권한이 없습니다."
        );
      } else {
        setMessage(
          error.response?.data
            ?.message ||
            "사용자 목록을 불러오지 못했습니다."
        );
      }

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  const filteredUsers =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return users.filter(
        (user) => {
          const name =
            String(
              user.name || ""
            ).toLowerCase();

          const email =
            String(
              user.email || ""
            ).toLowerCase();

          const matchesSearch =
            !normalizedSearch ||
            name.includes(
              normalizedSearch
            ) ||
            email.includes(
              normalizedSearch
            );

          const matchesRole =
            roleFilter === "ALL" ||
            user.role === roleFilter;

          const matchesStatus =
            statusFilter === "ALL" ||
            user.status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesRole &&
            matchesStatus
          );
        }
      );
    }, [
      users,
      search,
      roleFilter,
      statusFilter,
    ]);

  async function changeRole(
    user
  ) {
    const currentRole =
      user.role || "USER";

    const nextRole =
      currentRole === "ADMIN"
        ? "USER"
        : "ADMIN";

    const confirmMessage =
      nextRole === "ADMIN"
        ? `${user.name} 사용자에게 관리자 권한을 부여할까요?`
        : `${user.name} 사용자의 관리자 권한을 해제할까요?`;

    if (
      !window.confirm(
        confirmMessage
      )
    ) {
      return;
    }

    setChangingUserId(user.id);
    setMessage("");

    try {
      await api.put(
        `/admin/users/${user.id}/role`,
        {
          role: nextRole,
        }
      );

      setMessage(
        nextRole === "ADMIN"
          ? "관리자 권한을 부여했습니다."
          : "관리자 권한을 해제했습니다."
      );

      setMessageType("success");

      await loadUsers();
    } catch (error) {
      if (
        error.response?.status === 401
      ) {
        setMessage(
          "로그인이 만료되었습니다. 다시 로그인해 주세요."
        );
      } else if (
        error.response?.status === 403
      ) {
        setMessage(
          "사용자 권한을 변경할 관리자 권한이 없습니다."
        );
      } else {
        setMessage(
          error.response?.data
            ?.message ||
            "사용자 권한을 변경하지 못했습니다."
        );
      }

      setMessageType("error");
    } finally {
      setChangingUserId(null);
    }
  }

  async function changeStatus(
    user
  ) {
    const currentStatus =
      user.status || "ACTIVE";

    const nextStatus =
      currentStatus === "BLOCKED"
        ? "ACTIVE"
        : "BLOCKED";

    const confirmMessage =
      nextStatus === "BLOCKED"
        ? `${user.name} 사용자를 차단할까요?`
        : `${user.name} 사용자의 차단을 해제할까요?`;

    if (
      !window.confirm(
        confirmMessage
      )
    ) {
      return;
    }

    setChangingUserId(user.id);
    setMessage("");

    try {
      await api.put(
        `/admin/users/${user.id}/status`,
        {
          status: nextStatus,
        }
      );

      setMessage(
        nextStatus === "BLOCKED"
          ? "사용자를 차단했습니다."
          : "사용자 차단을 해제했습니다."
      );

      setMessageType("success");

      await loadUsers();
    } catch (error) {
      if (
        error.response?.status === 401
      ) {
        setMessage(
          "로그인이 만료되었습니다. 다시 로그인해 주세요."
        );
      } else if (
        error.response?.status === 403
      ) {
        setMessage(
          "사용자 상태를 변경할 관리자 권한이 없습니다."
        );
      } else {
        setMessage(
          error.response?.data
            ?.message ||
            "사용자 상태를 변경하지 못했습니다."
        );
      }

      setMessageType("error");
    } finally {
      setChangingUserId(null);
    }
  }

  function getRoleLabel(role) {
    if (role === "ADMIN") {
      return "관리자";
    }

    return "일반 사용자";
  }

  function getStatusLabel(status) {
    if (status === "BLOCKED") {
      return "차단됨";
    }

    if (status === "WITHDRAWN") {
      return "탈퇴";
    }

    return "활성";
  }

  const totalUsers =
    users.length;

  const adminCount =
    users.filter(
      (user) =>
        user.role === "ADMIN"
    ).length;

  const blockedCount =
    users.filter(
      (user) =>
        user.status === "BLOCKED"
    ).length;

  return (
    <div className="mx-auto max-w-7xl">
      <section className="mb-7">
        <p className="text-sm font-bold tracking-widest text-cyan-400">
          USER MANAGEMENT
        </p>

        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-black">
              사용자 관리
            </h1>

            <p className="mt-2 text-slate-400">
              사용자 권한과 계정 상태를
              관리합니다.
            </p>
          </div>

          <button
            type="button"
            onClick={loadUsers}
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

      <section className="mb-6 grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                전체 사용자
              </p>

              <p className="mt-2 text-3xl font-black">
                {totalUsers}
              </p>
            </div>

            <Users
              size={30}
              className="text-cyan-400"
            />
          </div>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                관리자
              </p>

              <p className="mt-2 text-3xl font-black">
                {adminCount}
              </p>
            </div>

            <ShieldCheck
              size={30}
              className="text-violet-400"
            />
          </div>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                차단된 사용자
              </p>

              <p className="mt-2 text-3xl font-black">
                {blockedCount}
              </p>
            </div>

            <Ban
              size={30}
              className="text-red-400"
            />
          </div>
        </article>
      </section>

      <section className="mb-6 grid gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 lg:grid-cols-[minmax(0,1fr)_190px_190px]">
        <label className="relative">
          <Search
            size={18}
            className="absolute left-3 top-3 text-slate-500"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(
                event.target.value
              );
            }}
            placeholder="이름 또는 이메일 검색"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500"
          />
        </label>

        <select
          value={roleFilter}
          onChange={(event) => {
            setRoleFilter(
              event.target.value
            );
          }}
          className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-white outline-none focus:border-cyan-500"
        >
          <option value="ALL">
            모든 권한
          </option>

          <option value="USER">
            일반 사용자
          </option>

          <option value="ADMIN">
            관리자
          </option>
        </select>

        <select
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(
              event.target.value
            );
          }}
          className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-white outline-none focus:border-cyan-500"
        >
          <option value="ALL">
            모든 상태
          </option>

          <option value="ACTIVE">
            활성 사용자
          </option>

          <option value="BLOCKED">
            차단된 사용자
          </option>

          <option value="WITHDRAWN">
            탈퇴 사용자
          </option>
        </select>
      </section>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
        <span>
          전체 사용자{" "}
          <strong className="text-white">
            {totalUsers}
          </strong>
          명
        </span>

        <span>
          검색 결과{" "}
          <strong className="text-cyan-400">
            {filteredUsers.length}
          </strong>
          명
        </span>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-16 text-center text-slate-400">
          사용자 목록을 불러오는 중입니다.
        </div>
      ) : filteredUsers.length ===
        0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-16 text-center text-slate-400">
          조건에 맞는 사용자가 없습니다.
        </div>
      ) : (
        <section className="grid gap-4">
          {filteredUsers.map(
            (user) => {
              const role =
                user.role || "USER";

              const status =
                user.status ||
                "ACTIVE";

              const isChanging =
                changingUserId ===
                user.id;

              return (
                <article
                  key={user.id}
                  className="grid min-w-0 gap-5 rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700 md:grid-cols-[64px_minmax(0,1fr)_auto] md:items-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800">
                    <UserRound
                      size={30}
                      className={
                        role === "ADMIN"
                          ? "text-violet-400"
                          : "text-cyan-400"
                      }
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={
                          "rounded-full px-3 py-1 text-xs font-bold " +
                          (role === "ADMIN"
                            ? "bg-violet-500/10 text-violet-300"
                            : "bg-cyan-500/10 text-cyan-300")
                        }
                      >
                        {getRoleLabel(
                          role
                        )}
                      </span>

                      <span
                        className={
                          "rounded-full px-3 py-1 text-xs font-bold " +
                          (status === "ACTIVE"
                            ? "bg-green-500/10 text-green-400"
                            : status ===
                                "BLOCKED"
                              ? "bg-red-500/10 text-red-400"
                              : "bg-slate-700 text-slate-300")
                        }
                      >
                        {getStatusLabel(
                          status
                        )}
                      </span>

                      <span className="text-xs text-slate-600">
                        ID {user.id}
                      </span>
                    </div>

                    <h2 className="mt-3 break-words text-xl font-bold">
                      {user.name ||
                        "이름 없음"}
                    </h2>

                    <p className="mt-1 break-all text-sm text-slate-400">
                      {user.email}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 md:justify-end">
                    <button
                      type="button"
                      disabled={
                        isChanging ||
                        status ===
                          "WITHDRAWN"
                      }
                      onClick={() => {
                        changeRole(user);
                      }}
                      className="flex items-center gap-2 rounded-xl border border-violet-500/30 px-4 py-2.5 font-bold text-violet-300 transition hover:bg-violet-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <ShieldCheck
                        size={17}
                      />

                      {role === "ADMIN"
                        ? "관리자 해제"
                        : "관리자 지정"}
                    </button>

                    <button
                      type="button"
                      disabled={
                        isChanging ||
                        status ===
                          "WITHDRAWN"
                      }
                      onClick={() => {
                        changeStatus(user);
                      }}
                      className={
                        "flex items-center gap-2 rounded-xl border px-4 py-2.5 font-bold transition disabled:cursor-not-allowed disabled:opacity-50 " +
                        (status ===
                        "BLOCKED"
                          ? "border-green-500/30 text-green-300 hover:bg-green-500/10"
                          : "border-red-500/30 text-red-300 hover:bg-red-500/10")
                      }
                    >
                      {status ===
                      "BLOCKED" ? (
                        <CheckCircle2
                          size={17}
                        />
                      ) : (
                        <Ban size={17} />
                      )}

                      {isChanging
                        ? "변경 중..."
                        : status ===
                            "BLOCKED"
                          ? "차단 해제"
                          : "사용자 차단"}
                    </button>
                  </div>
                </article>
              );
            }
          )}
        </section>
      )}
    </div>
  );
}

export default AdminUsersPage;