import axiosClient from '../config/axios';
import { API_ROOT } from '../constants';

export const fetchTiers = async (page, rowsPerPage, search) => {
  const response = await axiosClient.get(`${API_ROOT}/admin/tier/list`, {
    params: {
      page: page + 1,
      limit: rowsPerPage,
      search,
    },
  });

  return response.data;
};

export const fetchTierDetail = async (id) => {
  const response = await axiosClient.get(`${API_ROOT}/tiers/${id}`);
  return response.data;
};

export const createTier = async (tierData) => {
  const response = await axiosClient.post(`${API_ROOT}/tiers`, tierData);
  return response.data;
};

export const updateTier = async (id, tierData) => {
  const response = await axiosClient.put(`${API_ROOT}/tiers/${id}`, tierData);
  return response.data;
};

export const deleteTier = async (id) => {
  const response = await axiosClient.delete(`${API_ROOT}/tiers/${id}`);
  return response.data;
};