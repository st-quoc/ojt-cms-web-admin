import { useState, useEffect } from 'react';
import axiosClient from '../../config/axios';
import { API_ROOT } from '../../constants';

const useFetchTiers = (page, rowsPerPage, search) => {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);

  const fetchTiers = async () => {
    try {
      const response = await axiosClient.get(`${API_ROOT}/admin/tier/list`, {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          search,
        },
      });

      setTiers(response.data.tiers);
      setTotalItems(response.data.pagination.total);
    } catch (err) {
      setError(err.message || 'Failed to fetch tiers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTiers();
  }, []);

  return { tiers, loading, error, totalItems, fetchTiers };
};

export default useFetchTiers;
