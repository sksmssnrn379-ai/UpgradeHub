import {
  ArrowLeft,
  CheckCircle2,
  Cpu,
  LockKeyhole,
  Mail,
  User,
  UserPlus,
} from "lucide-react";

import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import api from "../api/axios.js";

function SignupPage() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [name, setName] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      await api.post("/auth/signup", {
        email: email.trim(),
        password: password,
        name: name.trim(),
      });

      window.alert(
        "회원가입이 완료되었습니다. 로그인해 주세요."
      );

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "회원가입에 실패했습니다.";

      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
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

          <Link
            to="/home"
            className="flex items-center gap-2 text-sm text-slate-300 transition hover:text-cyan-400"
          >
            <ArrowLeft size={17} />
            홈으로 돌아가기
          </Link>
        </div>
      </header>

      <main className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-6 py-12">
        <div className="pointer-events-none absolute left-0 top-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl lg:grid-cols-2">
          <section className="hidden flex-col justify-between bg-gradient-to-br from-cyan-950 via-slate-900 to-slate-950 p-10 lg:flex">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold tracking-wider text-cyan-300">
                <UserPlus size={15} />
                CREATE YOUR ACCOUNT
              </div>

              <h1 className="mt-7 text-5xl font-black leading-tight">
                BUILD
                <br />
                YOUR PC.
                <br />

                <span className="text-cyan-400">
                  UPGRADE SMARTER.
                </span>
              </h1>

              <p className="mt-6 max-w-md leading-7 text-slate-300">
                UpgradeHub 계정을 만들고 현재
                사용 중인 PC 구성과 구매한 부품을
                한곳에서 관리하세요.
              </p>
            </div>

            <div className="mt-12 space-y-3">
              <div className="flex items-start gap-3 rounded-xl border border-slate-700 bg-slate-900/60 p-4">
                <CheckCircle2
                  size={20}
                  className="mt-0.5 shrink-0 text-cyan-400"
                />

                <div>
                  <strong className="text-slate-200">
                    MY PC 관리
                  </strong>

                  <p className="mt-1 text-sm text-slate-400">
                    CPU, GPU, RAM 등 현재 PC
                    부품을 관리할 수 있습니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-700 bg-slate-900/60 p-4">
                <CheckCircle2
                  size={20}
                  className="mt-0.5 shrink-0 text-cyan-400"
                />

                <div>
                  <strong className="text-slate-200">
                    성능 및 호환성 확인
                  </strong>

                  <p className="mt-1 text-sm text-slate-400">
                    구매하려는 상품을 현재 PC와
                    비교할 수 있습니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-700 bg-slate-900/60 p-4">
                <CheckCircle2
                  size={20}
                  className="mt-0.5 shrink-0 text-green-400"
                />

                <div>
                  <strong className="text-slate-200">
                    AI 업그레이드 추천
                  </strong>

                  <p className="mt-1 text-sm text-slate-400">
                    예산과 사용 목적을 기준으로
                    구매 판단을 받을 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="p-7 sm:p-10 lg:p-12">
            <div className="mx-auto max-w-md">
              <div className="mb-8">
                <p className="mb-2 text-sm font-bold tracking-widest text-cyan-400">
                  JOIN UPGRADEHUB
                </p>

                <h2 className="text-3xl font-black">
                  회원가입
                </h2>

                <p className="mt-3 leading-6 text-slate-400">
                  기본 정보를 입력하고 나만의
                  UpgradeHub 계정을 만들어 보세요.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-slate-300"
                  >
                    이름
                  </label>

                  <div className="relative">
                    <User
                      size={19}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      id="name"
                      type="text"
                      value={name}
                      placeholder="이름을 입력하세요"
                      autoComplete="name"
                      maxLength={30}
                      onChange={(event) => {
                        setName(
                          event.target.value
                        );
                      }}
                      required
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3.5 pl-12 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-300"
                  >
                    이메일
                  </label>

                  <div className="relative">
                    <Mail
                      size={19}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      id="email"
                      type="email"
                      value={email}
                      placeholder="example@email.com"
                      autoComplete="email"
                      onChange={(event) => {
                        setEmail(
                          event.target.value
                        );
                      }}
                      required
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3.5 pl-12 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-slate-300"
                  >
                    비밀번호
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={19}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      id="password"
                      type="password"
                      value={password}
                      placeholder="8자 이상 입력하세요"
                      autoComplete="new-password"
                      minLength={8}
                      onChange={(event) => {
                        setPassword(
                          event.target.value
                        );
                      }}
                      required
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3.5 pl-12 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      최소 8자 이상 입력해 주세요.
                    </span>

                    <span
                      className={
                        password.length >= 8
                          ? "font-semibold text-green-400"
                          : "text-slate-600"
                      }
                    >
                      {password.length}/8
                    </span>
                  </div>
                </div>

                {message && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-300"
                  >
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3.5 font-black text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <UserPlus size={19} />

                  {loading
                    ? "가입 처리 중..."
                    : "회원가입"}
                </button>
              </form>

              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-800" />

                <span className="text-xs text-slate-500">
                  UPGRADEHUB
                </span>

                <div className="h-px flex-1 bg-slate-800" />
              </div>

              <div className="text-center">
                <p className="text-sm text-slate-400">
                  이미 계정이 있으신가요?
                </p>

                <button
                  type="button"
                  onClick={() => {
                    navigate("/login");
                  }}
                  className="mt-3 w-full rounded-xl border border-slate-700 py-3 font-bold text-slate-200 transition hover:border-cyan-500 hover:bg-cyan-500/10 hover:text-cyan-400"
                >
                  로그인으로 돌아가기
                </button>
              </div>

              <p className="mt-6 text-center text-xs leading-5 text-slate-600">
                회원가입 버튼을 누르면 UpgradeHub
                서비스 이용을 위한 계정이 생성됩니다.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default SignupPage;