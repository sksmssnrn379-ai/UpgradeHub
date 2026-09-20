import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import HomePage from "./pages/HomePage.jsx";
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
        path="/orders"
        element={<OrdersPage />}
      />

      <Route
        path="/checkout"
        element={<CheckoutPage />}
      />

      <Route
        path="/payment/success"
        element={<PaymentSuccessPage />}
      />

      <Route
        path="/payment/fail"
        element={<PaymentFailPage />}
      />

      <Route
        path="*"
        element={<Navigate to="/home" replace />}
      />
    </Routes>
  );
}

export default App;