import { useState, useEffect } from 'react';
import axiosClient from '../../config/axios';
import { API_ROOT } from '../../constants';

const useFetchPermissions = params => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axiosClient.get(
          `${API_ROOT}/auth/permissions/list`,
          {
            params,
          },
        );

        setPermissions(response.data.items);
      } catch (err) {
        setError(err.message || 'Failed to fetch permissions');
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  return { permissions, loading, error };
};

export default useFetchPermissions;
