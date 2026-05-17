import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

/**
 * PrivateRoute — Protects all dashboard routes.
 * Validates both token presence AND session expiry via the auth store.
 * Any unauthenticated or expired session is redirected to /login.
 */
const PrivateRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const checkSession = useAuthStore((state) => state.checkSession);

  // checkSession() also triggers auto-logout if token is expired
  const isValid = isAuthenticated && checkSession();

  return isValid ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
