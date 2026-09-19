import {
  ArrowLeft,
  Cpu,
  LockKeyhole,
  LogIn,
  Mail,
} from "lucide-react";

import { useState } from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import api from "../api/axios.js";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const destination =
    location.state?.from || "/home";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await api.post(
        "/auth/login",
        {
          email: email,
          password: password,
        }
      );

      localStorage.setItem(
        "token",
        response.data.token
      );
      localStorage.setItem(
        "role",
        response.data.role
      );

      navigate(destination, {
        replace: true,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "로그인에 실패했습니다.";

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
        <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl lg:grid-cols-2">
          <section className="hidden flex-col justify-between bg-gradient-to-br from-cyan-950 via-slate-900 to-slate-950 p-10 lg:flex">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold tracking-wider text-cyan-300">
                <Cpu size={15} />
                SMART PC UPGRADE
              </div>

              <h1 className="mt-7 text-5xl font-black leading-tight">
                BUILD
                <br />
                SMARTER.
                <br />
                <span className="text-cyan-400">
                  UPGRADE BETTER.
                </span>
              </h1>

              <p className="mt-6 max-w-md leading-7 text-slate-300">
                MY PC 구성과 구매 이력을 기반으로
                성능 비교, 부품 호환성 검사,
                업그레이드 추천을 확인하세요.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
                <strong className="block text-xl text-cyan-400">
                  MY PC
                </strong>

                <span className="mt-1 block text-xs text-slate-400">
                  부품 구성 관리
                </span>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
                <strong className="block text-xl text-cyan-400">
                  COMPARE
                </strong>

                <span className="mt-1 block text-xs text-slate-400">
                  성능 비교
                </span>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
                <strong className="block text-xl text-green-400">
                  AI
                </strong>

                <span className="mt-1 block text-xs text-slate-400">
                  구매 판단
                </span>
              </div>
            </div>
          </section>

          <section className="p-7 sm:p-10 lg:p-12">
            <div className="mx-auto max-w-md">
              <div className="mb-8">
                <p className="mb-2 text-sm font-bold tracking-widest text-cyan-400">
                  WELCOME BACK
                </p>

                <h2 className="text-3xl font-black">
                  로그인
                </h2>

                <p className="mt-3 leading-6 text-slate-400">
                  UpgradeHub 계정으로 로그인하고
                  나의 PC 구성을 관리하세요.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
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
                        setEmail(event.target.value);
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
                      placeholder="비밀번호를 입력하세요"
                      autoComplete="current-password"
                      onChange={(event) => {
                        setPassword(event.target.value);
                      }}
                      required
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3.5 pl-12 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>
                </div>

                {message && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                  >
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3.5 font-black text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <LogIn size={19} />

                  {loading
                    ? "로그인 중..."
                    : "로그인"}
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
                  아직 계정이 없으신가요?
                </p>

                <button
                  type="button"
                  onClick={() => {
                    navigate("/signup");
                  }}
                  className="mt-3 w-full rounded-xl border border-slate-700 py-3 font-bold text-slate-200 transition hover:border-cyan-500 hover:bg-cyan-500/10 hover:text-cyan-400"
                >
                  회원가입
                </button>
              </div>

              {location.state?.from && (
                <p className="mt-5 text-center text-xs text-slate-500">
                  로그인 후 요청한 페이지로 자동
                  이동합니다.
                </p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;