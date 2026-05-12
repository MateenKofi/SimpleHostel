import { Permission } from '@/lib/permissions';

export interface RoutePermission {
  path: string;
  requiredPermission?: Permission;
  requiredAnyPermission?: Permission[];
  allowedRoles?: string[];
}

export const ROUTE_PERMISSIONS: RoutePermission[] = [
  // Dashboard - general access
  { path: '/dashboard', allowedRoles: ['super_admin', 'admin', 'staff', 'resident'] },

  // Room Management
  { path: '/dashboard/room-management', requiredPermission: 'rooms.view' },
  { path: '/dashboard/room-assignment', requiredPermission: 'rooms.view' },

  // Resident Management
  { path: '/dashboard/resident-management', requiredPermission: 'residents.view' },
  { path: '/dashboard/resident-management/add-resident', requiredPermission: 'residents.create' },

  // Staff Management
  { path: '/dashboard/staff-management', requiredPermission: 'staff.view' },
  { path: '/dashboard/staff-management/add', requiredPermission: 'staff.create' },

  // Payment Management
  { path: '/dashboard/payment', requiredPermission: 'payments.view' },
  { path: '/dashboard/transactions', requiredPermission: 'payments.view' },
  { path: '/dashboard/top-up', requiredPermission: 'payments.create' },

  // Visitor Management
  { path: '/dashboard/visitor-management', requiredPermission: 'visitors.view' },

  // Maintenance
  { path: '/dashboard/maintenance', requiredPermission: 'maintenance.view' },
  { path: '/dashboard/make-request', requiredPermission: 'maintenance.create' },

  // Reports
  { path: '/dashboard/report', requiredPermission: 'reports.view' },

  // Settings
  { path: '/dashboard/settings', requiredPermission: 'settings.view' },

  // Hostel Management (admin only)
  { path: '/dashboard/hostel-management', requiredPermission: 'hostels.view' },

  // User Management
  { path: '/dashboard/users', requiredPermission: 'users.view' },

  // Announcements
  { path: '/dashboard/announcement-dashboard', requiredPermission: 'announcements.view' },

  // Calendar Year
  { path: '/dashboard/calendar-year-management', requiredPermission: 'hostels.view' },

  // Approve Hostel (super_admin only)
  { path: '/dashboard/approve-hostel', requiredPermission: 'hostels.verify', allowedRoles: ['super_admin'] },
];

export function getRoutePermission(pathname: string): RoutePermission | undefined {
  // Exact match first
  const exactMatch = ROUTE_PERMISSIONS.find(rp => rp.path === pathname);
  if (exactMatch) return exactMatch;

  // Partial match (for dynamic routes like /dashboard/view-room/:id)
  for (const rp of ROUTE_PERMISSIONS) {
    if (pathname.startsWith(rp.path + '/')) {
      return rp;
    }
  }

  return undefined;
}