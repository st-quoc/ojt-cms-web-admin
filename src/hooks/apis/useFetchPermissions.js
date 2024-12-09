import { useState, useEffect } from 'react';
import axiosClient from '../../config/axios';
import { API_ROOT } from '../../constants';

const useFetchPermissions = (search) => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(
        `${API_ROOT}/auth/permissions/list`,
        {
          params: { search },
        }
      );
      setPermissions(response.data.items);
    } catch (err) {
      setError(err.message || 'Failed to fetch permissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, [search]);

  return { permissions, loading, error, fetchPermissions };
};

export default useFetchPermissions;
