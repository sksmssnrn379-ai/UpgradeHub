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
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ComparePage from "./pages/ComparePage.jsx";
import AdvisorPage from "./pages/AdvisorPage.jsx";

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
        path="/products/:id"
        element={<ProductDetailPage />}
      />

      <Route
        path="/cart"
        element={<CartPage />}
      />

      <Route
        path="/mypc"
        element={<MyPcPage />}
      />

      <Route
        path="*"
        element={<Navigate to="/home" replace />}
      />

      <Route
        path="/cart"
        element={<CartPage />}
      />
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
    </Routes>
  );
}

export default App;