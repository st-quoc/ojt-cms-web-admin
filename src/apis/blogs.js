import axiosClient from "../config/axios";
import { API_ROOT } from "../constants";

export const fetchBlogs = async (page, rowsPerPage, search) => {
  const response = await axiosClient.get(`${API_ROOT}/admin/blog/list`, {
    params: {
      page: page + 1,
      limit: rowsPerPage,
      search,
    },
  });

  return response.data;
};

export const updateBlogStatus = async (blogId, statusData) => {
  try {
    const response = await axiosClient.put(
      `${API_ROOT}/admin/blog/change-status/${blogId}`,
      statusData,
    );

    return response.data;
  } catch (error) {
    console.error('Error updating blog status:', error);
    throw error;
  }
};