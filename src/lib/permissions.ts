export type PermissionCategory =
  | 'hostels'
  | 'rooms'
  | 'residents'
  | 'reservations'
  | 'payments'
  | 'staff'
  | 'visitors'
  | 'maintenance'
  | 'reports'
  | 'settings'
  | 'users'
  | 'announcements'
  | 'services';

export type PermissionAction =
  | 'view'
  | 'view_all'
  | 'view_own'
  | 'create'
  | 'edit'
  | 'edit_own'
  | 'delete'
  | 'confirm'
  | 'cancel'
  | 'approve'
  | 'reject'
  | 'export'
  | 'manage'
  | 'verify'
  | 'check_in'
  | 'check_out'
  | 'refund'
  | 'assign'
  | 'resolve'
  | 'reset_password';

export type Permission = `${PermissionCategory}.${PermissionAction}`;

export const PERMISSIONS = {
  HOSTELS_VIEW_ALL: 'hostels.view_all',
  HOSTELS_VIEW: 'hostels.view',
  HOSTELS_CREATE: 'hostels.create',
  HOSTELS_EDIT: 'hostels.edit',
  HOSTELS_DELETE: 'hostels.delete',
  HOSTELS_VERIFY: 'hostels.verify',

  ROOMS_VIEW: 'rooms.view',
  ROOMS_VIEW_ALL: 'rooms.view_all',
  ROOMS_CREATE: 'rooms.create',
  ROOMS_EDIT: 'rooms.edit',
  ROOMS_DELETE: 'rooms.delete',

  RESIDENTS_VIEW: 'residents.view',
  RESIDENTS_VIEW_ALL: 'residents.view_all',
  RESIDENTS_VIEW_OWN: 'residents.view_own',
  RESIDENTS_CREATE: 'residents.create',
  RESIDENTS_EDIT: 'residents.edit',
  RESIDENTS_EDIT_OWN: 'residents.edit_own',
  RESIDENTS_DELETE: 'residents.delete',

  RESERVATIONS_VIEW: 'reservations.view',
  RESERVATIONS_VIEW_ALL: 'reservations.view_all',
  RESERVATIONS_VIEW_OWN: 'reservations.view_own',
  RESERVATIONS_CREATE: 'reservations.create',
  RESERVATIONS_CONFIRM: 'reservations.confirm',
  RESERVATIONS_CANCEL: 'reservations.cancel',

  PAYMENTS_VIEW: 'payments.view',
  PAYMENTS_VIEW_ALL: 'payments.view_all',
  PAYMENTS_VIEW_OWN: 'payments.view_own',
  PAYMENTS_CREATE: 'payments.create',
  PAYMENTS_CONFIRM: 'payments.confirm',
  PAYMENTS_REFUND: 'payments.refund',

  STAFF_VIEW_ALL: 'staff.view_all',
  STAFF_VIEW: 'staff.view',
  STAFF_CREATE: 'staff.create',
  STAFF_EDIT: 'staff.edit',
  STAFF_DELETE: 'staff.delete',

  VISITORS_VIEW: 'visitors.view',
  VISITORS_CREATE: 'visitors.create',
  VISITORS_CHECK_IN: 'visitors.check_in',
  VISITORS_CHECK_OUT: 'visitors.check_out',

  MAINTENANCE_VIEW: 'maintenance.view',
  MAINTENANCE_CREATE: 'maintenance.create',
  MAINTENANCE_ASSIGN: 'maintenance.assign',
  MAINTENANCE_RESOLVE: 'maintenance.resolve',

  REPORTS_VIEW: 'reports.view',
  REPORTS_VIEW_ALL: 'reports.view_all',
  REPORTS_EXPORT: 'reports.export',

  SETTINGS_VIEW: 'settings.view',
  SETTINGS_MANAGE: 'settings.manage',

  USERS_VIEW: 'users.view',
  USERS_CREATE: 'users.create',
  USERS_EDIT: 'users.edit',
  USERS_DELETE: 'users.delete',
  USERS_RESET_PASSWORD: 'users.reset_password',

  ANNOUNCEMENTS_VIEW: 'announcements.view',
  ANNOUNCEMENTS_CREATE: 'announcements.create',
  ANNOUNCEMENTS_EDIT: 'announcements.edit',
  ANNOUNCEMENTS_DELETE: 'announcements.delete',

  SERVICES_VIEW: 'services.view',
  SERVICES_CREATE: 'services.create',
  SERVICES_EDIT: 'services.edit',
  SERVICES_DELETE: 'services.delete',
} as const;

export const CATEGORIES: Record<PermissionCategory, { label: string; description: string }> = {
  hostels: { label: 'Hostels', description: 'Manage hostels' },
  rooms: { label: 'Rooms', description: 'Manage rooms' },
  residents: { label: 'Residents', description: 'Manage residents' },
  reservations: { label: 'Reservations', description: 'Manage reservations' },
  payments: { label: 'Payments', description: 'Manage payments' },
  staff: { label: 'Staff', description: 'Manage staff' },
  visitors: { label: 'Visitors', description: 'Manage visitors' },
  maintenance: { label: 'Maintenance', description: 'Manage maintenance' },
  reports: { label: 'Reports', description: 'View and export reports' },
  settings: { label: 'Settings', description: 'System settings' },
  users: { label: 'Users', description: 'Manage users' },
  announcements: { label: 'Announcements', description: 'Manage announcements' },
  services: { label: 'Services', description: 'Manage services' },
};

export function can(userPermissions: Permission[] | undefined, required: Permission): boolean {
  if (!userPermissions || userPermissions.length === 0) return false;
  return userPermissions.includes(required);
}

export function canAny(userPermissions: Permission[] | undefined, required: Permission[]): boolean {
  if (!userPermissions || userPermissions.length === 0) return false;
  return required.some((perm) => userPermissions.includes(perm));
}

export function canAll(userPermissions: Permission[] | undefined, required: Permission[]): boolean {
  if (!userPermissions || userPermissions.length === 0) return false;
  return required.every((perm) => userPermissions.includes(perm));
}

export function getPermissionCategory(permission: Permission): PermissionCategory {
  return permission.split('.')[0] as PermissionCategory;
}

export function getPermissionsByCategory(permissions: Permission[]): Record<PermissionCategory, Permission[]> {
  const result: Record<PermissionCategory, Permission[]> = {
    hostels: [],
    rooms: [],
    residents: [],
    reservations: [],
    payments: [],
    staff: [],
    visitors: [],
    maintenance: [],
    reports: [],
    settings: [],
    users: [],
    announcements: [],
    services: [],
  };

  for (const permission of permissions) {
    const category = getPermissionCategory(permission);
    if (result[category]) {
      result[category].push(permission);
    }
  }

  return result;
}