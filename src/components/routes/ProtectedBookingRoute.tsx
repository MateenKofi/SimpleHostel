import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

/**
 * ProtectedRoute for booking-related pages.
 * Redirects unauthenticated users to the login page with a return URL.
 */
const ProtectedBookingRoute = () => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  // Get the current path for redirect after login
  const currentPath = window.location.pathname + window.location.search;
  const loginPath = `/login?redirect=${encodeURIComponent(currentPath)}`;

  // Check if user is authenticated
  const isAuthenticated = token && token !== "undefined" && user;

  return isAuthenticated ? <Outlet /> : <Navigate to={loginPath} replace />;
};

export default ProtectedBookingRoute;
