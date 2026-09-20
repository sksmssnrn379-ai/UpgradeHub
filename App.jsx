import { Navigate } from "react-router-dom";
import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";

import LoginPage from "./pages/LoginPage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";

import CheckoutPage from "./pages/CheckoutPage.jsx";
import PaymentSuccessPage from "./pages/PaymentSuccessPage.jsx";
import PaymentFailPage from "./pages/PaymentFailPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
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
        path="/*"
        element={<Navigate to="/login" replace />}
      />
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
      <Route
  path="/orders"
  element={<OrdersPage />}
/>
    </Routes>
  );
}

export default App;