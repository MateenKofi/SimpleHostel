import { useAuthStore } from '@/stores/useAuthStore';
import { Permission, can, canAny, canAll } from '@/lib/permissions';

export function usePermission() {
  const permissions = useAuthStore((state) => state.permissions);
  const role = useAuthStore((state) => state.role);

  // super_admin bypasses all permission checks — mirrors the <Can> component behaviour
  const isSuperAdmin = role === 'super_admin';

  const hasPermission = (required: Permission): boolean => {
    if (isSuperAdmin) return true;
    return can(permissions, required);
  };

  const hasAnyPermission = (required: Permission[]): boolean => {
    if (isSuperAdmin) return true;
    return canAny(permissions, required);
  };

  const hasAllPermissions = (required: Permission[]): boolean => {
    if (isSuperAdmin) return true;
    return canAll(permissions, required);
  };

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}