import { useNavigate } from "react-router-dom";

function ProductsPage() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="products-page">
      <header className="products-header">
        <div>
          <h1>UpgradeHub</h1>
          <p>PC 부품 상품 목록</p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </header>

      <main className="products-content">
        <h2>상품 목록</h2>

        <p>
          로그인이 정상적으로 완료되었습니다.
        </p>

        <p>
          다음 단계에서 백엔드 상품 API를 연결합니다.
        </p>
      </main>
    </div>
  );
}

export default ProductsPage;