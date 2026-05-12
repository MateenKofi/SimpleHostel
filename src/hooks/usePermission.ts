import { useAuthStore } from '@/stores/useAuthStore';
import { Permission, can, canAny, canAll } from '@/lib/permissions';

export function usePermission() {
  const permissions = useAuthStore((state) => state.permissions);

  const hasPermission = (required: Permission): boolean => {
    return can(permissions, required);
  };

  const hasAnyPermission = (required: Permission[]): boolean => {
    return canAny(permissions, required);
  };

  const hasAllPermissions = (required: Permission[]): boolean => {
    return canAll(permissions, required);
  };

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}