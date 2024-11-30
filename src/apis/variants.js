import axiosClient from '../config/axios';
import { API_ROOT } from '../constants';


export const fetchCategories = async (page, rowsPerPage, search) => {
  const response = await axiosClient.get(`${API_ROOT}/admin/manager/list`, {
    params: {
      page: page + 1,
      limit: rowsPerPage,
      search,
    },
  });

  return response.data;
};
