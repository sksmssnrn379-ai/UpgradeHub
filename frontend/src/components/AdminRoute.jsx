import {
  Navigate,
  useLocation,
} from "react-router-dom";

function AdminRoute({ children }) {
  const location = useLocation();

  const token =
    localStorage.getItem("token");

  const role =
    localStorage.getItem("role");

  if (!token) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location.pathname,
        }}
        replace
      />
    );
  }

  if (role !== "ADMIN") {
    return (
      <Navigate
        to="/home"
        replace
      />
    );
  }

  return children;
}

export default AdminRoute;