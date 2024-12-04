import axiosClient from '../config/axios';
import { API_ROOT } from '../constants';

export const refreshTokenAPI = async refreshToken => {
  return await axiosClient.put(`${API_ROOT}/auth/refresh-token`, {
    refreshToken,
  });
};

export const fetchManagers = async (page, rowsPerPage, search) => {
  const response = await axiosClient.get(`${API_ROOT}/admin/manager/list`, {
    params: {
      page: page + 1,
      limit: rowsPerPage,
      search,
    },
  });

  return response.data;
};

export const updateManagerStatus = async (managerId, statusData) => {
  try {
    const response = await axiosClient.put(
      `${API_ROOT}/admin/manager/change-status/${managerId}`,
      statusData,
    );

    return response.data;
  } catch (error) {
    console.error('Error updating manager status:', error);
    throw error;
  }
};

export const fetchUsers = async (page, rowsPerPage, search) => {
  const response = await axiosClient.get(`${API_ROOT}/admin/user/list`, {
    params: {
      page: page + 1,
      limit: rowsPerPage,
      search,
    },
  });

  return response.data;
};

export const updateUserStatus = async (userId, statusData) => {
  try {
    const response = await axiosClient.put(
      `${API_ROOT}/admin/user/change-status/${userId}`,
      statusData,
    );

    return response.data;
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};

export const fetchPermissions = async (page, search) => {
  const response = await axiosClient.get(`${API_ROOT}/auth/permissions/list`, {
    params: {
      search,
    },
  });

  return response.data;
};
