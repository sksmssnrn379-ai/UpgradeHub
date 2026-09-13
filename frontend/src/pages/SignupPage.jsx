import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function SignupPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      await api.post(
        "/auth/signup",
        {
          email: email,
          password: password,
          name: name,
        }
      );

      window.alert(
        "회원가입이 완료되었습니다."
      );

      navigate("/login");
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
    <div className="signup-page">
      <div className="signup-card">
        <h1>UpgradeHub</h1>

        <h2>회원가입</h2>

        <p className="signup-description">
          계정을 만들고 MY PC를 관리해 보세요.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">
              이름
            </label>

            <input
              id="name"
              type="text"
              value={name}
              placeholder="이름을 입력하세요"
              autoComplete="name"
              onChange={(event) => {
                setName(event.target.value);
              }}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              이메일
            </label>

            <input
              id="email"
              type="email"
              value={email}
              placeholder="이메일을 입력하세요"
              autoComplete="email"
              onChange={(event) => {
                setEmail(event.target.value);
              }}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              비밀번호
            </label>

            <input
              id="password"
              type="password"
              value={password}
              placeholder="8자 이상 입력하세요"
              autoComplete="new-password"
              minLength={8}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "가입 처리 중..."
              : "회원가입"}
          </button>
        </form>

        {message && (
          <p className="signup-message">
            {message}
          </p>
        )}

        <button
          type="button"
          className="login-link"
          onClick={() => {
            navigate("/login");
          }}
        >
          로그인으로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default SignupPage;