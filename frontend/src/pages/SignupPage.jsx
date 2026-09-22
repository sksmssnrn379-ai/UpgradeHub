import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Cpu,
  LockKeyhole,
  Mail,
  ShieldCheck,
  User,
  UserPlus,
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
  const [
  verificationCode,
  setVerificationCode,
] = useState("");

const [
  codeSent,
  setCodeSent,
] = useState(false);

const [
  emailVerified,
  setEmailVerified,
] = useState(false);

const [
  sendingCode,
  setSendingCode,
] = useState(false);

const [
  verifyingCode,
  setVerifyingCode,
] = useState(false);

const [
  resendSeconds,
  setResendSeconds,
] = useState(0);

const [
  messageType,
  setMessageType,
] = useState("");
async function sendVerificationCode() {
  const normalizedEmail =
    email.trim()
      .toLowerCase();

  if (!normalizedEmail) {
    setMessage(
      "이메일을 입력해 주세요."
    );

    setMessageType("error");
    return;
  }

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    !emailPattern.test(
      normalizedEmail
    )
  ) {
    setMessage(
      "올바른 이메일 주소를 입력해 주세요."
    );

    setMessageType("error");
    return;
  }

  setSendingCode(true);
  setMessage("");
  setMessageType("");

  try {
    const response =
      await api.post(
        "/auth/email/send",
        {
          email:
            normalizedEmail,
        }
      );

    setCodeSent(true);
    setEmailVerified(false);
    setVerificationCode("");
    setResendSeconds(60);

    setMessage(
      response.data?.message ||
        "인증번호를 전송했습니다."
    );

    setMessageType("success");
  } catch (error) {
    setMessage(
      error.response?.data
        ?.message ||
        "인증번호를 전송하지 못했습니다."
    );

    setMessageType("error");
  } finally {
    setSendingCode(false);
  }
}
async function verifyEmailCode() {
  const normalizedEmail =
    email.trim()
      .toLowerCase();

  if (
    !/^[0-9]{6}$/.test(
      verificationCode
    )
  ) {
    setMessage(
      "인증번호 숫자 6자리를 입력해 주세요."
    );

    setMessageType("error");
    return;
  }

  setVerifyingCode(true);
  setMessage("");
  setMessageType("");

  try {
    const response =
      await api.post(
        "/auth/email/verify",
        {
          email:
            normalizedEmail,

          code:
            verificationCode,
        }
      );

    setEmailVerified(true);
    setResendSeconds(0);

    setMessage(
      response.data?.message ||
        "이메일 인증이 완료되었습니다."
    );

    setMessageType("success");
  } catch (error) {
    setEmailVerified(false);

    setMessage(
      error.response?.data
        ?.message ||
        "인증번호가 올바르지 않습니다."
    );

    setMessageType("error");
  } finally {
    setVerifyingCode(false);
  }
}
  async function handleSubmit(
  event
) {
  event.preventDefault();

  if (!emailVerified) {
    setMessage(
      "이메일 인증을 완료해 주세요."
    );

    setMessageType("error");
    return;
  }

  if (!name.trim()) {
    setMessage(
      "이름을 입력해 주세요."
    );

    setMessageType("error");
    return;
  }

  if (password.length < 8) {
    setMessage(
      "비밀번호는 8자 이상 입력해 주세요."
    );

    setMessageType("error");
    return;
  }

  setLoading(true);
  setMessage("");
  setMessageType("");

  try {
    await api.post(
      "/auth/signup",
      {
        email:
          email.trim()
            .toLowerCase(),

        password,

        name:
          name.trim(),
      }
    );

    window.alert(
      "회원가입이 완료되었습니다. 로그인해 주세요."
    );

    navigate("/login", {
      replace: true,
    });
  } catch (error) {
    setMessage(
      error.response?.data
        ?.message ||
        "회원가입에 실패했습니다."
    );

    setMessageType("error");
  } finally {
    setLoading(false);
  }
}
  useEffect(() => {
  if (resendSeconds <= 0) {
    return undefined;
  }

  const timerId =
    window.setInterval(() => {
      setResendSeconds(
        (current) => {
          if (current <= 1) {
            window.clearInterval(
              timerId
            );

            return 0;
          }

          return current - 1;
        }
      );
    }, 1000);

  return () => {
    window.clearInterval(
      timerId
    );
  };
}, [resendSeconds]);
function handleEmailChange(
  event
) {
  setEmail(
    event.target.value
  );

  setCodeSent(false);
  setEmailVerified(false);
  setVerificationCode("");
  setResendSeconds(0);
  setMessage("");
  setMessageType("");
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

  <div className="flex flex-col gap-2 sm:flex-row">
    <div className="relative min-w-0 flex-1">
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
        disabled={
          emailVerified
        }
        onChange={
          handleEmailChange
        }
        required
        className={
          "w-full rounded-xl border bg-slate-950 py-3.5 pl-12 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-70 " +
          (emailVerified
            ? "border-green-500/40 focus:border-green-500 focus:ring-green-500/20"
            : "border-slate-700 focus:border-cyan-500 focus:ring-cyan-500/20")
        }
      />

      {emailVerified && (
        <CheckCircle2
          size={19}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400"
        />
      )}
    </div>

    <button
      type="button"
      onClick={
        sendVerificationCode
      }
      disabled={
        sendingCode ||
        emailVerified ||
        resendSeconds > 0
      }
      className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3.5 font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {resendSeconds > 0 ? (
        <>
          <Clock3 size={17} />
          {resendSeconds}초
        </>
      ) : sendingCode ? (
        "전송 중..."
      ) : codeSent ? (
        "인증번호 재전송"
      ) : (
        "인증번호 전송"
      )}
    </button>
  </div>

  {emailVerified && (
    <div className="mt-3 flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm font-bold text-green-300">
      <ShieldCheck
        size={18}
      />

      이메일 인증이 완료되었습니다.
    </div>
  )}
</div>

{codeSent &&
  !emailVerified && (
    <div>
      <label
        htmlFor="verificationCode"
        className="mb-2 block text-sm font-semibold text-slate-300"
      >
        이메일 인증번호
      </label>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <ShieldCheck
            size={19}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            id="verificationCode"
            type="text"
            value={
              verificationCode
            }
            onChange={(event) => {
              setVerificationCode(
                event.target.value
                  .replace(
                    /[^0-9]/g,
                    ""
                  )
                  .slice(0, 6)
              );

              setMessage("");
              setMessageType("");
            }}
            placeholder="인증번호 숫자 6자리"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3.5 pl-12 pr-4 tracking-[0.3em] text-white outline-none transition placeholder:tracking-normal placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          />
        </div>

        <button
          type="button"
          onClick={
            verifyEmailCode
          }
          disabled={
            verifyingCode ||
            verificationCode
              .length !== 6
          }
          className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-green-500/40 px-5 py-3.5 font-bold text-green-300 transition hover:bg-green-500/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CheckCircle2
            size={17}
          />

          {verifyingCode
            ? "확인 중..."
            : "인증 확인"}
        </button>
      </div>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        이메일로 전송된 인증번호를
        5분 이내에 입력해 주세요.
      </p>
    </div>
  )}

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
    className={
      "rounded-xl border px-4 py-3 text-sm leading-6 " +
      (messageType ===
      "success"
        ? "border-green-500/30 bg-green-500/10 text-green-300"
        : "border-red-500/30 bg-red-500/10 text-red-300")
    }
  >
    {message}
  </div>
)}

                <button
  type="submit"
  disabled={
    loading ||
    !emailVerified
  }
  className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3.5 font-black text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
>
  <UserPlus size={19} />

  {loading
    ? "가입 처리 중..."
    : emailVerified
      ? "회원가입"
      : "이메일 인증이 필요합니다"}
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