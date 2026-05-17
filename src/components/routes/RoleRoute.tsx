import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

type AppRole = "super_admin" | "admin" | "staff" | "resident";

interface RoleRouteProps {
  /**
   * The roles that are permitted to access this route group.
   * Users with any role NOT in this list are redirected.
   */
  allowedRoles: AppRole[];
  /**
   * Where to redirect unauthorized users.
   * Defaults to /dashboard (their own home) rather than /login,
   * since they are already authenticated.
   */
  redirectTo?: string;
}

/**
 * RoleRoute — A role-aware outlet guard for dashboard route groups.
 * Nest inside <PrivateRoute> in App.tsx to add role enforcement on top
 * of the existing authentication check.
 *
 * Usage in App.tsx:
 *   <Route element={<RoleRoute allowedRoles={["admin", "super_admin"]} />}>
 *     <Route path="staff-management" element={<StaffManagement />} />
 *   </Route>
 */
const RoleRoute = ({ allowedRoles, redirectTo = "/dashboard" }: RoleRouteProps) => {
  const role = useAuthStore((state) => state.role);

  if (!role || !allowedRoles.includes(role as AppRole)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
