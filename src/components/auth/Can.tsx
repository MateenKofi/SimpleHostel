import { ReactNode } from 'react';
import { Permission, can, canAny } from '@/lib/permissions';
import { useAuthStore } from '@/stores/useAuthStore';

interface CanProps {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
  requireAny?: Permission[];
}

export function Can({ permission, children, fallback = null, requireAny }: CanProps) {
  const permissions = useAuthStore((state) => state.permissions);
  const role = useAuthStore((state) => state.role);

  // Super admin always has access
  if (role === 'super_admin') {
    return <>{children}</>;
  }

  let hasAccess = false;

  if (requireAny && requireAny.length > 0) {
    hasAccess = canAny(permissions, requireAny);
  } else {
    hasAccess = can(permissions, permission);
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}