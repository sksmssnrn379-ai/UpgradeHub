import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";

import ProductsPage from "./pages/ProductsPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";

import CartPage from "./pages/CartPage.jsx";
import MyPcPage from "./pages/MyPcPage.jsx";
import ComparePage from "./pages/ComparePage.jsx";
import AdvisorPage from "./pages/AdvisorPage.jsx";
import PurchasedPartsPage from "./pages/PurchasedPartsPage.jsx";
import AddressPage from "./pages/AddressPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";

import CheckoutPage from "./pages/CheckoutPage.jsx";
import PaymentSuccessPage from "./pages/PaymentSuccessPage.jsx";
import PaymentFailPage from "./pages/PaymentFailPage.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";

import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage.jsx";
import AdminProductsPage from "./pages/admin/AdminProductsPage.jsx";
import AdminUsersPage from "./pages/admin/AdminUsersPage.jsx";


function App() {
  return (
    <Routes>

      {/* =========================
          일반 페이지
      ========================= */}

      <Route
        path="/"
        element={<Navigate to="/home" replace />}
      />

      <Route
        path="/home"
        element={<HomePage />}
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/signup"
        element={<SignupPage />}
      />

      <Route
        path="/products"
        element={<ProductsPage />}
      />

      <Route
        path="/products/:id"
        element={<ProductDetailPage />}
      />


      {/* =========================
          로그인 필요 페이지
      ========================= */}

      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mypc"
        element={
          <ProtectedRoute>
            <MyPcPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/compare/:id"
        element={
          <ProtectedRoute>
            <ComparePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/advisor"
        element={
          <ProtectedRoute>
            <AdvisorPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mypc/purchased-parts"
        element={
          <ProtectedRoute>
            <PurchasedPartsPage />
          </ProtectedRoute>
        }
      />

      {/* 주문 내역 */}
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        }
      />

      {/* 결제 */}
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/payment/success"
        element={
          <ProtectedRoute>
            <PaymentSuccessPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/payment/fail"
        element={<PaymentFailPage />}
      />


      {/* =========================
          관리자
      ========================= */}

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route
          index
          element={<AdminDashboardPage />}
        />

        <Route
          path="products"
          element={<AdminProductsPage />}
        />

        <Route
          path="users"
          element={<AdminUsersPage />}
        />
      </Route>


      {/* =========================
          존재하지 않는 주소
      ========================= */}

      <Route
        path="*"
        element={
          <Navigate to="/home" replace />
        }
      />
      <Route
  path="/addresses"
  element={
    <ProtectedRoute>
      <AddressPage />
    </ProtectedRoute>
  }
/>
    </Routes>
  );
}

export default App;