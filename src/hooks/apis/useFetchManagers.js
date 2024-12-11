import { useState, useEffect } from 'react';
import axiosClient from '../../config/axios';
import { API_ROOT } from '../../constants';

const useFetchManagers = (page, rowsPerPage, search) => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);

  const fetchManagers = async () => {
    try {
      const response = await axiosClient.get(`${API_ROOT}/admin/manager/list`, {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          search,
        },
      });

      setManagers(response.data.managers);
      setTotalItems(response.data.total);
    } catch (err) {
      setError(err.message || 'Failed to fetch managers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, [page, rowsPerPage, search]);

  return { managers, loading, error, totalItems, fetchManagers };
};

export default useFetchManagers;
