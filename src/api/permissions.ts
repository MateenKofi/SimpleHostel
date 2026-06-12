import axiosInstance from './axiosInstance';

export const getAllPermissions = async () => {
  const response = await axiosInstance.get('/permissions');
  return response.data?.data;
};

export const getPermissionsByRole = async (role: string, hostelId?: string) => {
  const params = hostelId ? { hostelId } : {};
  const response = await axiosInstance.get(`/permissions/by-role/${role}`, { params });
  return response.data?.data;
};

export const getAllRolesPermissions = async (hostelId?: string) => {
  const params = hostelId ? { hostelId } : {};
  const response = await axiosInstance.get('/permissions/roles', { params });
  return response.data?.data;
};

export const getAvailableHostels = async () => {
  const response = await axiosInstance.get('/permissions/hostels');
  return response.data?.data;
};

export const assignPermissionsToRole = async (role: string, permissions: string[], hostelId?: string) => {
  const response = await axiosInstance.put(`/permissions/assign/${role}`, { 
    permissions,
    hostelId: hostelId || undefined,
  });
  return response.data;
};

export const togglePermission = async (role: string, permission: string, hostelId?: string) => {
  const response = await axiosInstance.patch(`/permissions/toggle/${role}`, { 
    permission,
    hostelId: hostelId || undefined,
  });
  return response.data;
};
// ---- User-specific permission API ----

export const getUserPermissions = async (userId: string) => {
  const response = await axiosInstance.get(`/permissions/user/${userId}`);
  return response.data?.data;
};

export const assignUserPermissions = async (userId: string, permissions: string[]) => {
  const response = await axiosInstance.put(`/permissions/user/${userId}`, { permissions });
  return response.data;
};

export const toggleUserPermission = async (userId: string, permission: string) => {
  const response = await axiosInstance.patch(`/permissions/user/${userId}/toggle`, { permission });
  return response.data;
};
